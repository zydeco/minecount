#include "cNBT/nbt.h"

// items that may have data are also stored at a different place, with a combined id+data

#define BYDATA_BASE     4096 // must be multiple of 16
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
#define PLANK_BYDATA    (BYDATA_BASE+160)
#define SANDSTN_BYDATA  (BYDATA_BASE+176)
#define SPAWNEGG_BYDATA (BYDATA_BASE+192)
#define WSLAB_BYDATA    (BYDATA_BASE+416)
#define WDSLAB_BYDATA   (BYDATA_BASE+432)
#define COBBWALL_BYDATA (BYDATA_BASE+448)
#define QUARTZ_BYDATA   (BYDATA_BASE+464)
#define CARPET_BYDATA   (BYDATA_BASE+480)
#define SCLAY_BYDATA    (BYDATA_BASE+496)
#define BYDATA_END      (BYDATA_BASE+512)

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
#define ID_PLANK        5
#define ID_SANDSTONE    24
#define ID_SPAWNEGG     383
#define ID_WSLAB        126
#define ID_WDSLAB       125
#define ID_COBBWALL     139
#define ID_QUARTZ       155
#define ID_CARPET       171
#define ID_SCLAY        159

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
        case ID_PLANK:
        case ID_SANDSTONE:
        case ID_SPAWNEGG:
        case ID_WSLAB:
        case ID_WDSLAB:
        case ID_COBBWALL:
        case ID_QUARTZ:
        case ID_CARPET:
        case ID_SCLAY:
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
    if (i >= SPAWNEGG_BYDATA && i < WSLAB_BYDATA) return i - SPAWNEGG_BYDATA; // special case, data can be >16
    return i%16;
}

// returns the item of a combind item+data
static inline int data_id_get_item(int i) {
    if (!is_data(i)) return i;
    // compare in reverse order, big ones first
    if (i >= SCLAY_BYDATA) return ID_SCLAY;
    if (i >= CARPET_BYDATA) return ID_CARPET;
    if (i >= QUARTZ_BYDATA) return ID_QUARTZ;
    if (i >= COBBWALL_BYDATA) return ID_COBBWALL;
    if (i >= WDSLAB_BYDATA) return ID_WDSLAB;
    if (i >= WSLAB_BYDATA) return ID_WSLAB;
    if (i >= SPAWNEGG_BYDATA) return ID_SPAWNEGG;
    if (i >= SANDSTN_BYDATA) return ID_SANDSTONE;
    if (i >= PLANK_BYDATA) return ID_PLANK;
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
        case ID_WOOD:
            data &= 3;
            return WOOD_BYDATA + (data < 4 ? data : 0);
        case ID_SAPLING:
            data &= 3;
            return SAPLING_BYDATA + (data < 4 ? data : 0);
        case ID_SLAB:
            data &= 7;
            return SLAB_BYDATA + data;
        case ID_DSLAB:
            return DSLAB_BYDATA + data;
        case ID_TALL_GRASS:
            data &= 3;
            return GRASS_BYDATA + (data < 3 ? data : 0);
        case ID_STONE_BRICK:
            data &= 3;
            return STNBRICK_BYDATA + (data < 4 ? data : 0);
        case ID_LEAVES:
            data &= 3;
            return LEAVES_BYDATA + (data < 4 ? data : 0);
        case ID_PLANK:
            data &= 3;
            return PLANK_BYDATA + (data < 4 ? data : 0);
        case ID_SANDSTONE:
            data &= 3;
            return SANDSTN_BYDATA + (data < 3 ? data : 0);
        case ID_SPAWNEGG:
            return SPAWNEGG_BYDATA + data;
        case ID_WSLAB:
            data &= 7;
            return WSLAB_BYDATA + (data < 4 ? data : 0);
        case ID_WDSLAB:
            data &= 7;
            return WDSLAB_BYDATA + (data < 4 ? data : 0);
        case ID_COBBWALL:
            data &= 1;
            return COBBWALL_BYDATA + data;
        case ID_QUARTZ:
            return QUARTZ_BYDATA + (data < 3 ? data : 2);
        case ID_CARPET:
            return CARPET_BYDATA + data;
        case ID_SCLAY:
            return SCLAY_BYDATA + data;
        default:
            return item;
    }
}

void count_items(nbt_node *items, uint64_t *count, size_t max);