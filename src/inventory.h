#include "cNBT/nbt.h"

// items that may have data are also stored at a different place, with a combined id+data

#define BYDATA_BASE     1024 // must be multiple of 16
#define WOOL_BYDATA     (BYDATA_BASE)
#define DYE_BYDATA      (BYDATA_BASE+16)
#define COAL_BYDATA     (BYDATA_BASE+32)
#define WOOD_BYDATA     (BYDATA_BASE+48)
#define SAPLING_BYDATA  (BYDATA_BASE+64)
#define SLAB_BYDATA     (BYDATA_BASE+80)
#define DSLAB_BYDATA    (BYDATA_BASE+96)
#define GRASS_BYDATA    (BYDATA_BASE+112)
#define STNBRICK_BYDATA (BYDATA_BASE+128)
#define LEAVES_BYDATA   (BYDATA_BASE+144)
#define SPAWNEGG_BYDATA (BYDATA_BASE+160)
#define BYDATA_END      (BYDATA_BASE+416)

#define ID_WOOL         35
#define ID_DYE          351
#define ID_COAL         263
#define ID_WOOD         17
#define ID_SAPLING      6
#define ID_SLAB         44
#define ID_DSLAB        43
#define ID_TALL_GRASS   31
#define ID_STONE_BRICK  98
#define ID_LEAVES       18
#define ID_SPAWNEGG     383

// returns true if an item id must be stored with data too
static inline bool has_data(int16_t item) {
    switch(item) {
        case ID_WOOL:
        case ID_DYE:
        case ID_COAL:
        case ID_WOOD:
        case ID_SAPLING:
        case ID_SLAB:
        case ID_DSLAB:
        case ID_TALL_GRASS:
        case ID_STONE_BRICK:
        case ID_LEAVES:
        case ID_SPAWNEGG:
            return true;
        default:
            return false;
    }
}

// returns true if an id is a combined item+data
static inline bool is_data(int i) {
    if (i >= BYDATA_BASE && i < BYDATA_END) return true;
    return false;
}

// returns the data of a combind item+data
static inline int data_id_get_data(int i) {
    if (i >= SPAWNEGG_BYDATA) return i - SPAWNEGG_BYDATA; // special case, data can be >16
    return i%16;
}

// returns the item of a combind item+data
static inline int data_id_get_item(int i) {
    if (!is_data(i)) return 0;
    // compare in reverse order, big ones first
    if (i >= SPAWNEGG_BYDATA) return ID_SPAWNEGG;
    if (i >= LEAVES_BYDATA) return ID_LEAVES;
    if (i >= STNBRICK_BYDATA) return ID_STONE_BRICK;
    if (i >= GRASS_BYDATA) return ID_TALL_GRASS;
    if (i >= DSLAB_BYDATA) return ID_DSLAB;
    if (i >= SLAB_BYDATA) return ID_SLAB;
    if (i >= SAPLING_BYDATA) return ID_SAPLING;
    if (i >= WOOD_BYDATA) return ID_WOOD;
    if (i >= COAL_BYDATA) return ID_COAL;
    if (i >= DYE_BYDATA) return ID_DYE;
    if (i >= WOOL_BYDATA) return ID_WOOL;
    return 0;
}

// returns the combined item+data value for an item and its data
static inline int item_data_id(int16_t item, int data) {
    switch(item) {
        case ID_WOOL:
            return WOOL_BYDATA + data;
        case ID_DYE:
            return DYE_BYDATA + data;
        case ID_COAL:
            data &= 1;
            return COAL_BYDATA + data;
            return ID_COAL;
        case ID_WOOD:
            data &= 3;
            return WOOD_BYDATA + (data < 3 ? data : 0);
        case ID_SAPLING:
            data &= 3;
            return SAPLING_BYDATA + (data < 3 ? data : 0);
        case ID_SLAB:
            data &= 7;
            return SLAB_BYDATA + (data < 6 ? data : 0);
        case ID_DSLAB:
            data &= 7;
            return DSLAB_BYDATA + (data < 6 ? data : 0);
        case ID_TALL_GRASS:
            data &= 3;
            return GRASS_BYDATA + (data < 3 ? data : 0);
        case ID_STONE_BRICK:
            data &= 3;
            return STNBRICK_BYDATA + (data < 3? data : 0);
        case ID_LEAVES:
            data &= 3;
            return LEAVES_BYDATA + (data < 3? data : 0);
        case ID_SPAWNEGG:
            return SPAWNEGG_BYDATA + data;
        default:
            return BYDATA_END;
    }
}

void count_items(nbt_node *items, uint64_t *count, size_t max);