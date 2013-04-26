#include <stdio.h>
#include <stdarg.h>
#include <errno.h>
#include <dirent.h>
#include <unistd.h>
#include <string.h>
#include <strings.h>
#include <stdlib.h>
#include <stdint.h>
#include <libgen.h>
#include <getopt.h>
#include <fcntl.h>
#include "thread.h"
#include "cNBT/nbt.h"
#include "inventory.h"

// returns an array of max elements with the block count of each ID
// includes items in chests and dispensers
uint64_t * mcr_count(MCR *mcr, int mx, int mz, size_t max);
uint64_t * mca_count(MCR *mcr, int mx, int mz, size_t max);

#define ITEM_MAX BYDATA_END
#define VERSION "1.5.4"
#define NTRIES 8

// some evil globals
uint64_t count[ITEM_MAX];
mutex_t mutex;

struct {
    int nthreads; // -t
    int verbose; // -v
    bool countWorld; // -w
    bool countContainers; // -c
    bool countInventories; // -i
    int *bounds; // -b x1,x2,y1,y2,z1,z2
    bool *find; // -f 1,2,3...
} options = {
    0, 0, false, false, false, NULL, NULL
};

struct region_queue {
    mutex_t mutex;
    int count, max, pos;
    thread_t *thread;
    char *base, **names;
    uint8_t *tries;
} region_queue = {
    .count = 0,
    .max = 0,
    .pos = 0,
    .thread = NULL,
    .base = NULL,
    .names = NULL,
    .tries = NULL};

void output_json(FILE *fp, const uint64_t *count, size_t max, bool all);

void mergecount(const uint64_t *new) {
    mutex_lock(mutex);
    for(size_t i=0; i < ITEM_MAX; i++) 
        count[i] += new[i];
    mutex_unlock(mutex);
}

void fail(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    vfprintf(stderr, fmt, ap);
    va_end(ap);
    exit(1);
}

// returns an absolute path or NULL
char *get_next_region_path(uint8_t *tries) {
    char *name = NULL;
    mutex_lock(region_queue.mutex);
    if (region_queue.pos < region_queue.count) {
        name = region_queue.names[region_queue.pos];
        if (tries) *tries = region_queue.tries[region_queue.pos];
        region_queue.names[region_queue.pos] = NULL;
        region_queue.pos++;
    }
    mutex_unlock(region_queue.mutex);
    
    if (name == NULL) return NULL;
    
    if (name[0] == '/') return name;
    char *path = malloc(strlen(region_queue.base) + strlen(name) + 2);
    strcpy(path, region_queue.base);
    if (path[strlen(path)-1] != '/') strcat(path, "/");
    strcat(path, name);
    free(name);
    return path;
}

void queue_region_file(char *name, uint8_t tries) {
    mutex_lock(region_queue.mutex);
    if (region_queue.count == region_queue.max) {
        // embiggen the array
        region_queue.max += 64;
        region_queue.names = realloc(region_queue.names, region_queue.max * sizeof(char*));
        region_queue.tries = realloc(region_queue.tries, region_queue.max * sizeof(uint8_t));
        for(int i=region_queue.count; i < region_queue.max; i++) region_queue.names[i] = NULL;
    }
    
    // add
    region_queue.names[region_queue.count] = strdup(name);
    region_queue.tries[region_queue.count] = tries;
    region_queue.count++;
    
    mutex_unlock(region_queue.mutex);
}

void* region_count(void *data) {
    char *path, *base;
    uint8_t tries;
    
    while ((path = get_next_region_path(&tries))) {
        int rx, rz;
        char type;
        base = strrchr(path, '/') + 1;
        // get region coords
        sscanf(base, "r.%d.%d.mc%c", &rx, &rz, &type);
        // count region
        MCR *mcr = mcr_open(path, O_RDONLY);
        if (mcr == NULL) {
            printf("%s: %s\n", base, strerror(errno));
            free(path);
            return NULL;
        }
        uint64_t *lcount = NULL;
        switch(type) {
            case 'a':
                lcount = mca_count(mcr, rx, rz, ITEM_MAX);
                break;
            case 'r':
                lcount = mcr_count(mcr, rx, rz, ITEM_MAX);
                break;
        }
        
        // merge count
        if (lcount) {
            printf("%s\n", base);
            mergecount(lcount);
            free(lcount);
        } else if (tries) {
            printf("%s FAILED - requeuing\n", base);
            queue_region_file(path, tries-1);
        } else {
            printf("%s FAILED ENOUGH\n", base);
        }
        free(path);
        
        mcr_close(mcr);
    }
    return data;
}

int print_usage() {
    fprintf(stdout, "minecount "VERSION" - count blocks and items on a minecraft world\n"
            "Copyright (C) 2011-2013 Jesus A. Alvarez\n"
            "usage: minecount -[wciv] [-t threads] [-f find] [-b bounds] world_path output_path\n"
            "\t-w: include world blocks\n"
            "\t-c: include chest/dispenser contents\n"
            "\t-i: include player inventories\n"
            "\t-v: verbose\n"
            "\t-t threads: number of threads to run\n"
            "\t-f 1,2,3: find items and report their position\n"
            "\t-b x,y,z x,y,z: count only in specified bounds\n"
            );
    exit(1);
}

int main (int argc, char * const *argv) {
    // parse args
    int opt;
    const struct option opts[] = {
        {"verbose", no_argument, NULL, 'v'},
        {"world", no_argument, NULL, 'w'},
        {"containers", no_argument, NULL, 'c'},
        {"inventories", no_argument, NULL, 'i'},
        {"inventory", no_argument, NULL, 'i'},
        {"threads", required_argument, NULL, 't'},
        {"bounds", required_argument, NULL, 'b'},
        {"find", required_argument, NULL, 'f'},
        {0, 0, 0, 0}
    };
    while((opt = getopt_long(argc, argv, ":vwcit:b:f:h?", opts, NULL)) != -1) {
        switch(opt) {
            case 'v':
                options.verbose++;
                break;
            case 'w':
                options.countWorld = true;
                break;
            case 'c':
                options.countContainers = true;
                break;
            case 'i':
                options.countInventories = true;
                break;
            case 't':
                options.nthreads = strtol(optarg, NULL, 10);
                break;
            case 'b': {
                // parse bounds
                int *bounds = calloc(6, sizeof(int));
                if (sscanf(optarg, "%d,%d,%d %d,%d,%d", 
                      &bounds[0], &bounds[2], &bounds[4],
                      &bounds[1], &bounds[3], &bounds[5]) != 6) {
                          fprintf(stderr, "invalid bounds format: required x,y,z x,y,z\n");
                          free(bounds);
                      } else {
                          // sort bounds
                          int tmp;
                          if (bounds[0] > bounds[1]) {
                              tmp = bounds[0];
                              bounds[0] = bounds[1];
                              bounds[1] = tmp;
                          }
                          if (bounds[2] > bounds[3]) {
                              tmp = bounds[2];
                              bounds[2] = bounds[3];
                              bounds[3] = tmp;
                          }
                          if (bounds[4] > bounds[5]) {
                              tmp = bounds[4];
                              bounds[4] = bounds[5];
                              bounds[5] = tmp;
                          }
                          options.bounds = bounds;
                      }
                break;
            }
            case 'f': {
                // find blocks
                bool *item_find = calloc(ITEM_MAX, sizeof(bool));
                char *findstr, *str, *tok;
                const char *delim = ",";
                findstr = str = strdup(optarg);
                while ((tok = strtok(str, delim))) {
                    str = NULL;
                    int i = 0, d = -1;
                    if (sscanf(tok, "%u.%u", &i, &d) == 2) {
                        item_find[item_data_id(i,d)] = true;
                        printf("finding %s (%d)\n", tok, item_data_id(i,d));}
                    if (i && d == -1) {
                        item_find[i] = true;
                        printf("finding %d\n", i);
                    }
                }
                free(findstr);
                options.find = item_find;
                break;
            }
            case 'h':
                print_usage();
                break;
        }
    }
    if (options.nthreads == 0) options.nthreads = cpu_cores();
    if (argc - optind != 2) print_usage();
    
    // init mutexes
    mutex_init(mutex);
    mutex_init(region_queue.mutex);
    
    // get output path
    char *output = NULL;
    if (argv[optind+1][0] == '/') {
        output = strdup(argv[optind+1]);
    } else {
        char *wd = getcwd(NULL, 0);
        if (wd == NULL) {
            perror("getcwd");
            exit(2);
        }
        output = malloc(strlen(wd) + strlen(argv[optind+1]) + 2);
        strcpy(output, wd);
        strcat(output, "/");
        strcat(output, argv[optind+1]);
        free(wd);
        printf("saving output to %s\n", output);
    }
    // go there
    if (chdir(argv[optind])) fail("could not get into the world: %s\n", strerror(errno));
    
    // count zero
    memset(count, 0, sizeof count);
    
    // get region files
    if (options.countWorld || options.countContainers) {
        DIR *regionDir = opendir("region");
        if (regionDir == NULL) fail("could not open region directory: %s\n", strerror(errno));
        struct dirent *ent;
        
        chdir("region");
        
        // find mca files
        char *ext = ".mcr";
        while((ent = readdir(regionDir))) {
            if (strcmp(ent->d_name + strlen(ent->d_name) - 4, ".mca") == 0) {
                ext = ".mca";
                break;
            }
        }
        
        // find region files
        region_queue.base = getcwd(NULL, 0);
        rewinddir(regionDir);
        while((ent = readdir(regionDir))) {
            // skip non-region files
            if (strcmp(ent->d_name + strlen(ent->d_name) - 4, ext)) continue;
            
            // queue region
            queue_region_file(ent->d_name, NTRIES);
        }
        closedir(regionDir);
        chdir("..");
        
        // start region counting threads
        printf("Using %d threads for world data\n", options.nthreads);
        region_queue.thread = calloc(options.nthreads, sizeof(thread_t));
        for(int i=0; i < options.nthreads; i++)
            thread_init(region_queue.thread[i], region_count, NULL);
    }
    
    // get player inventories
    DIR *playerDir;
    if (options.countInventories && (playerDir = opendir("players"))) {
        chdir("players");
        uint64_t *icount = calloc(ITEM_MAX, sizeof(uint64_t));
        struct dirent *ent;
        while((ent = readdir(playerDir))) {
            // skip non-.dat files
            if (strcmp(ent->d_name + strlen(ent->d_name) - 4, ".dat")) continue;

            // read player inventory
            nbt_node *player = nbt_parse_path(ent->d_name);
            if (player == NULL) continue;
            printf("%s\n", ent->d_name);
            nbt_node *inventory = nbt_find_by_path(player, ".Inventory");
            if (inventory) count_items(inventory, icount, ITEM_MAX);
            nbt_free(player);
        }
        closedir(playerDir);
        chdir("..");
        mergecount(icount);
        free(icount);
    }
    
    // wait for threads
    if (region_queue.thread) for(int i=0; i < options.nthreads; i++)
        thread_join(region_queue.thread[i]);
    
    // destroy mutexes
    mutex_destroy(mutex);
    mutex_destroy(region_queue.mutex);
    
    // extras:
    // doors and beds occupy two blocks
    count[71] /= 2; // iron door
    count[64] /= 2; // wooden door
    count[26] /= 2; // bed
    
    // free stuff
    if (options.find) free(options.find);
    if (options.bounds) free(options.bounds);
    
    // output
    FILE *outp = fopen(output, "w");
    free(output);
    if (outp) {
        output_json(outp, count, ITEM_MAX, false);
        fclose(outp);
    } else {
        perror("error saving output");
    }
    
    return 0;
}

void output_json(FILE *fp, const uint64_t *count, size_t max, bool all) {
    fprintf(fp, "{");
    bool first = true;
    size_t last = 0;
    for(size_t i=0; i < max; i++) if (count[i] || all) last = i;
    for(size_t i=0; i < max; i++) {
        if (!(count[i] || all)) continue;
        if (is_data(i)) {
            // special items by data
            int data = data_id_get_data(i);
            int item = data_id_get_item(i);
            fprintf(fp, "%s\"%d.%d\": %llu", first?"":",", item, data, (unsigned long long)count[i]);
            first = false;
        } else if (!has_data(i)) {
            fprintf(fp, "%s\"%d\": %llu", first?"":",", (int)i, (unsigned long long)count[i]);
            first = false;
        }
    }
    fprintf(fp, "}");
}

void count_containers(nbt_node *root, size_t max, uint64_t *blkCnt) {
    nbt_node *n = nbt_find_by_path(root, ".Level.TileEntities");
    if (n && n->type == TAG_LIST) {
        const struct list_head* pos;
        list_for_each(pos, &n->payload.tag_list.list->entry) {
            nbt_node *entry = list_entry(pos, struct tag_list, entry)->data;
            if (entry->type == TAG_COMPOUND) {
                nbt_node *items = nbt_find_by_path(entry, ".Items");
                if (items) count_items(items, blkCnt, max);
            }
        }
    }
}

uint64_t * mcr_count(MCR *mcr, int mx, int mz, size_t max) {
    uint64_t *blkCnt = NULL;
    if (mcr == NULL) return NULL;
    blkCnt = calloc(max, sizeof(uint64_t));
    if (blkCnt == NULL) return NULL;
    
    // TODO: skip entire mcr if it's out of bounds (check x and z only)
    
    // visit all chunks
    for(int x=0; x < 32; x++) for(int z=0; z<32; z++) {
        nbt_node *root = mcr_chunk_get(mcr,x,z);
        if (root == NULL) continue;
        
        // TODO: skip entire chunk if it's out of bounds (check x and z only)
        
        // count blocks
        if (options.countWorld) {
            nbt_node *n = nbt_find_by_path(root, ".Level.Blocks");
            nbt_node *nd = nbt_find_by_path(root, ".Level.Data");
            if (n && n->type == TAG_BYTE_ARRAY && nd && nd->type == TAG_BYTE_ARRAY) {
                for(int i=0; i < n->payload.tag_byte_array.length; i++) {
                    unsigned char item = n->payload.tag_byte_array.data[i];
                    unsigned int data = nd->payload.tag_byte_array.data[i/2];
                    unsigned int itemWithData = 0;
                    if (item >= max) continue;
                    
                    // item data
                    if (has_data(item)) {
                        if (i%2 == 1) data >>= 4;
                        data &= 0x0F;
                        itemWithData = item_data_id(item, data);
                    }
                    
                    // block position
                    if (options.bounds || options.find) {
                        int bx = (i / (128*16)) + (16*x) + (32*16*mx);
                        int by = (i % 128);
                        int bz = (((i % (128 * 16)) - by) / 128) + (16*z) + (32*16*mz);
                        
                        if (options.bounds) {
                            if (bx < options.bounds[0] || bx > options.bounds[1] ||
                                by < options.bounds[2] || by > options.bounds[3] ||
                                bz < options.bounds[4] || bz > options.bounds[5]) continue;
                        }
                        if (options.find) {
                            if (itemWithData && options.find[itemWithData]) {
                                fprintf(stdout, "found %u.%u at %d,%d,%d\n", (unsigned)item, data, bx,by,bz);
                            } else if (options.find[item]) {
                                fprintf(stdout, "found %u at %d,%d,%d\n", (unsigned)item, bx,by,bz);
                            }
                        }
                    }
                    
                    blkCnt[item]++;
                    if (itemWithData) blkCnt[itemWithData]++;
                }
            }
        }
        
        // count containers
        if (options.countContainers) count_containers(root, max, blkCnt);
        
        nbt_free(root);
    }
    
    return blkCnt;
}

uint64_t * mca_count(MCR *mcr, int mx, int mz, size_t max) {
    uint64_t *blkCnt = NULL;
    if (mcr == NULL) return NULL;
    blkCnt = calloc(max, sizeof(uint64_t));
    if (blkCnt == NULL) return NULL;
    // TODO: skip entire mca if it's out of bounds (check x and z only)
    
    // visit all chunks
    for(int x=0; x<32; x++) for(int z=0; z<32; z++) {
        nbt_node *root = mcr_chunk_get(mcr,x,z);
        if (root == NULL) continue;
        
        // TODO: skip entire chunk if it's out of bounds (check x and z only)
        
        // count blocks
        if (options.countWorld) {
            nbt_node *s = nbt_find_by_path(root, ".Level.Sections");
            const struct list_head* pos;
            if (s && s->type == TAG_LIST) list_for_each(pos, &s->payload.tag_list.list->entry) {
                nbt_node *section = list_entry(pos, struct tag_list, entry)->data;
                if (section->type != TAG_COMPOUND) continue;
                nbt_node *n = nbt_find_by_path(section, ".Blocks");
                nbt_node *nn = nbt_find_by_path(section, ".AddBlocks");
                nbt_node *nd = nbt_find_by_path(section, ".Data");
                
                for(int i=0; i < n->payload.tag_byte_array.length; i++) {
                    int16_t item = n->payload.tag_byte_array.data[i];
                    int16_t data = nd->payload.tag_byte_array.data[i/2];
                    unsigned int itemWithData = 0;
                    if (i%2 == 1) data >>= 4;
                    data &= 0x0F;
                    
                    // extended item ID
                    if (nn && nn->type == TAG_BYTE_ARRAY) {
                        int16_t add = nn->payload.tag_byte_array.data[i/2];
                        if (i%2 == 1) add >>= 4;
                        item += (add & 0x0F) << 8;
                    }
                    
                    // item data
                    if (has_data(item)) {
                        itemWithData = item_data_id(item, data);
                    }
                    
                    // block position
                    if (options.bounds || options.find) {
                        nbt_node *nsy = nbt_find_by_path(section, ".Y");
                        int sy = nsy?nsy->payload.tag_byte:-1;
                        int bx = (i % 16) + (32*16*mx) + (16*x);
                        int by = (16*sy) + (i / 256);
                        int bz = ((i%256)/16) + (16*z) + (32*16*mz);
                        
                        if (options.bounds) {
                            if (bx < options.bounds[0] || bx > options.bounds[1] ||
                                by < options.bounds[2] || by > options.bounds[3] ||
                                bz < options.bounds[4] || bz > options.bounds[5]) continue;
                        }
                        if (options.find) {
                            if (itemWithData && options.find[itemWithData]) {
                                fprintf(stdout, "found %u.%u at %d,%d,%d\n", (unsigned)item, data, bx,by,bz);
                            } else if (options.find[item]) {
                                fprintf(stdout, "found %u at %d,%d,%d\n", (unsigned)item, bx,by,bz);
                            }
                        }
                    }
                    
                    // count
                    blkCnt[item]++;
                    if (itemWithData) blkCnt[itemWithData]++;
                }
            }
        }
        
        // count containers
        if (options.countContainers) count_containers(root, max, blkCnt);
        
        nbt_free(root);
    }
    
    return blkCnt;
}