# downgrade-replay

 This utility converts SCR replays formats to 1.16 (mostly). Why? Because I didn't care to do all of this in C++ with (in openbw repo), maybe eventually.
 

## Conversion
 * Converts replay magic header to TitanReactor (0x53526577) specific one since we are fiddling with the format
 * Adds two new blocks, SCR pointer (to preserve SCR data), and container size block.
   * The container size block tells openbw whether to make unit max 1700 or 3400. Note that we have to peek into the replay commands to find this out as some SCR replays use 1.16 unit tags and therefore require the 1700 container size.
 * Compresses all blocks with implode
 * Converts SCR CHK sections to 1.16 CHK sections
 * TODO: Retain the SCR blocks at the end of the file

### Exposed functions
- `parseReplay` parses both SCR and 1.16 replays.
- `CommandsStream` streamed command parsing.
- `convertReplay` downgrades SCR replays
- `Version` an enum. 0 = broodwar. 1 = remastered. 2 = titanReactor.
- `ChkDowngrader` optional but necessary atm for downgrading CHK chunks.