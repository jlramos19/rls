extends Node

signal time_tick(ingame_datetime: Dictionary)

var ingame_datetime: Dictionary = {
    "year":2400,"month":1,"day":1,"weekday":6,
    "hour":0,"minute":0
}
var speed: int = 0
const NORMAL_RATE := 2.5
const FAST_RATE := 1.0
var _accum: float = 0.0

func _process(delta: float) -> void:
    if speed == 0:
        return
    var rate = speed == 1 ? NORMAL_RATE : FAST_RATE
    _accum += delta
    if _accum >= rate:
        _accum -= rate
        ingame_datetime.hour += 1
        if ingame_datetime.hour >= 24:
            ingame_datetime.hour = 0
            ingame_datetime.day += 1
            ingame_datetime.weekday = int((ingame_datetime.weekday + 1) % 7)
        time_tick.emit(ingame_datetime)

func pause() -> void:
    speed = 0

func play_normal() -> void:
    speed = 1

func play_fast() -> void:
    speed = 4

func skip_to(target: Dictionary) -> void:
    ingame_datetime = target
    time_tick.emit(ingame_datetime)
