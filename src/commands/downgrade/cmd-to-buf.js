const { CMDS } = require("../commands");
const { uint16, uint8 } = require("../../util/alloc");
const BufferList = require("bl/BufferList");
const scrUnitTag = require("../unit-tag-to-bw");

/**
 * Downgrades SCR replay commands to BW replay commands with partial unit tag conversion.
 */
const commandToBuf = (id, cmd, isRemastered) => {
  if (!isRemastered) {
    return [id, cmd.data];
  }
  switch (id) {
    case CMDS.RIGHT_CLICK_EXT.id: {
      return [
        CMDS.RIGHT_CLICK.id,
        new BufferList([
          uint16(cmd.x),
          uint16(cmd.y),
          uint16(scrUnitTag(cmd.unitTag)),
          uint16(cmd.unit),
          uint8(cmd.queued),
        ]),
      ];
    }
    case CMDS.SELECT_EXT.id:
    case CMDS.SELECTION_ADD_EXT.id:
    case CMDS.SELECTION_REMOVE_EXT.id: {
      const mapping = {};
      mapping[CMDS.SELECT_EXT.id] = CMDS.SELECT;
      mapping[CMDS.SELECTION_ADD_EXT.id] = CMDS.SELECTION_ADD;
      mapping[CMDS.SELECTION_REMOVE_EXT.id] = CMDS.SELECTION_REMOVE;

      return [
        mapping[id].id,
        new BufferList([
          uint8(cmd.unitTags.length),
          ...cmd.unitTags.map((tag) => uint16(scrUnitTag(tag))),
        ]),
      ];
    }
    case CMDS.TARGETED_ORDER_EXT.id: {
      return [
        CMDS.TARGETED_ORDER.id,
        new BufferList([
          uint16(cmd.x),
          uint16(cmd.y),
          uint16(scrUnitTag(cmd.unitTag)),
          uint16(cmd.unitTypeId),
          uint8(cmd.order),
          uint8(cmd.queued),
        ]),
      ];
    }
    case CMDS.UNLOAD_EXT.id: {
      return [CMDS.UNLOAD.id, new BufferList(uint16(scrUnitTag(cmd.unitTag)))];
    }
    case CMDS.CANCEL_TRAIN.id: {
      return [id, new BufferList(uint16(scrUnitTag(cmd.unitTag)))];
    }
    default:
      return [id, cmd.data];
  }
};

module.exports = commandToBuf;
