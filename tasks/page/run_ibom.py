#!/usr/bin/env python3

import json
import sys
import os
import os.path
import shutil
import tempfile
import wx
import pcbnew

from InteractiveHtmlBom.InteractiveHtmlBom.core import ibom
from InteractiveHtmlBom.InteractiveHtmlBom.core.config import Config
from InteractiveHtmlBom.InteractiveHtmlBom.ecad import get_parser_by_extension
from InteractiveHtmlBom.InteractiveHtmlBom.ecad.kicad import PcbnewParser
from InteractiveHtmlBom.InteractiveHtmlBom.version import version


board_file = os.path.abspath(sys.argv[1])
info_file = os.path.abspath(sys.argv[2])
out_file = os.path.abspath(sys.argv[3])

BASEDIR = os.path.dirname(sys.argv[0])
IBOM_CONFIG = os.path.join(BASEDIR, 'ibom_config/config.ini')

os.chdir(os.path.dirname(board_file))

logger = ibom.Logger(cli=True)
ibom.log = logger

board = None
ext = os.path.splitext(board_file)[1]
if ext == '.brd':
    # Work around problems with KiCad EAGLE import: there appears to
    # be a bug in pcbnew that causes the Python API to return
    # incorrect offset values after import of EAGLE files. Saving and
    # reloading the board results in a board with correct offsets.
    tmp_board = pcbnew.LoadBoard(board_file, pcbnew.IO_MGR.EAGLE)
    tmpdir = tempfile.mkdtemp()
    tmpfile = os.path.join(tmpdir, 'import_{}.kicad_pcb'.format(os.getpid()))
    pcbnew.SaveBoard(tmpfile, tmp_board)
    board = pcbnew.LoadBoard(tmpfile)
    shutil.rmtree(tmpdir, ignore_errors=True)

print('DISPLAY')
print(os.environ.get('DISPLAY'))
app = wx.App()

config = Config(version)
config.config_file = IBOM_CONFIG
config.load_from_ini()

if board is None:
    parser = get_parser_by_extension(board_file, config, logger)
else:
    parser = PcbnewParser(board_file, config, logger, board)

pcbdata, components = parser.parse()
if not pcbdata or not components:
    logger.error('Parsing failed.')
    sys.exit(1)

pcbdata['bom'] = ibom.generate_bom(components, config, None)
pcbdata['ibom_version'] = config.version

with open(info_file) as ifp:
    info = json.load(ifp)
    pcbdata['summary'] = info['summary']
    pcbdata['metadata']['title'] = info['id'].split('/')[-1]

with open(out_file, 'w') as fp:
    json.dump(pcbdata, fp)
