import machine

rtc = machine.RTC()
mode = rtc.memory()

# ---------------------------------------------------------
# OTA UPDATE MODE
# ---------------------------------------------------------

if mode in [b"u", b"ch"] or mode.startswith(b"check"):

    if mode == b"ch":
        import check_update

    elif mode.startswith(b"check"):
        import updater_hotspot

    elif mode == b"u":
        import updater

        # updater.py zanecha RTC premennu v niektorom z tychto stavov: b"uok" / b"uko" - ale tie sa mozu pri starte stanice uzivatelsky prepisat, takze ich ignorujem

# ---------------------------------------------------------
# NORMAL PROGRAM MODE
# ---------------------------------------------------------

else:

    # b"stq" - zrychleny boot mode pre hotspot (pri restarte kvoli WiFi)
    # b"stp" - standartny boot pre hotspot
    # b"" - starndartny station boot
    # - v station.py:
    # b"sto" - zrychleny station boot
    # b"ste" - vynutene automaticke uspatie stanice (kvoli slabej baterii)

    if mode == b"stq":
        import hotspot

    elif mode == b"stp":
        rtc.memory(b"") # vymaze premennu z RTC pamate takze po normalnom ukonceni HotSpotu a restarte ESP32 sa system nabootuje znova do station.py
        import hotspot

    elif mode == b"ste":
        import hybernate

    else:
        import station
        # DEBUG ON - pri sucasnej architekture nefunguje:
        #station.debug = True # KO

