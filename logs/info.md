# Naming Schema
N-CACHED_BUILD-build status-reason.log

- N: its number in the steps followed to generate the logs.
- CACHED_BUILD: false/cached.
- build status: pass/fail.
- reason: the failure error message.

# Description
- `01-clean.log` & `02-clean.log`
    - Narrow the log to the part that fails in the 01, i.e., the build fails at some point in 01 and works fine in 02 all the logs after this point doesn't add any thing to the comparsion.
    - Remove all `travis_time` timestamps.
- `02-clean2.log` & `03-clean.log`
    - Take the full log as the build pass yet the test fail
    - Remove all `travis_time` timestamps.
    - Remove ninja's number of steps in [xxxx/xxxx] form.

# Commands used to generate the files
- `01-clean.log`  -> `sed -n '1,904p;905q' 01-false-fail-buildExited.log | sed '/travis_time/d' >  01-clean.log`.
- `02-clean.log` -> `sed -n '1,904p;905q' 02-false-fail-tests.log  | sed '/travis_time/d' >  02-clean.log`.
- `02-clean2.log` -> `sed -n '1,6320p;6320q' 02-false-fail-tests.log | sed '/travis_time/d' | sed -e 's/\[[[:digit:]]\+\/[[:digit:]]\{4\}\]//g'  >  02-clean2.log`.
- `03-clean.log` -> `sed -n '1,6320p;6320q' 03-false-pass-void.log   | sed '/travis_time/d' | sed -e 's/\[[[:digit:]]\+\/[[:digit:]]\{4\}\]//g'  >  03-clean.log`.
