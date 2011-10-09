#include <stdlib.h>
#include "inventory.h"

void count_items(nbt_node *n, uint64_t *blkCnt, size_t max) {
    if (n && n->type == TAG_LIST) {
        const struct list_head* pos;
        list_for_each(pos, &n->payload.tag_list.list->entry) {
            nbt_node *entry = list_entry(pos, struct tag_list, entry)->data;
            nbt_node *nodeID = nbt_find_by_path(entry, ".id");
            nbt_node *nodeCount = nbt_find_by_path(entry, ".Count");
            if (nodeID && nodeCount && nodeID->type == TAG_SHORT && nodeCount->type == TAG_BYTE) {
                int16_t item = nodeID->payload.tag_short;
                if ((size_t)item >= max) continue;
                blkCnt[item] += nodeCount->payload.tag_byte;
                if (has_data(item)) {
                    nbt_node *nodeDamage = nbt_find_by_path(entry, ".Damage");
                    int16_t data = 0;
                    if (nodeDamage && nodeDamage->type == TAG_SHORT) data = nodeDamage->payload.tag_short;
                    blkCnt[item_data_id(item, data)] += nodeCount->payload.tag_byte;
                }
            }
        }
    }
}