extends Control

@onready var clock_label: Label = $TopBar/GameClockLabel
@onready var pause_btn: Button = $TopBar/TimeControls/Pause
@onready var play_btn: Button = $TopBar/TimeControls/Play
@onready var fast_btn: Button = $TopBar/TimeControls/Fast
@onready var skip_btn: Button = $TopBar/TimeControls/Skip

func _ready() -> void:
    TimeController.time_tick.connect(_on_tick)
    pause_btn.pressed.connect(TimeController.pause)
    play_btn.pressed.connect(TimeController.play_normal)
    fast_btn.pressed.connect(TimeController.play_fast)
    skip_btn.pressed.connect(_on_skip)
    _on_tick(TimeController.ingame_datetime)

func _on_tick(dt: Dictionary) -> void:
    var wd = ["SUN","MON","TUE","WED","THU","FRI","SAT"][dt.weekday]
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
    var m = months[dt.month-1]
    var day = str(dt.day).pad_zeroes(2)
    var hour = dt.hour % 12
    if hour == 0:
        hour = 12
    var ampm = dt.hour < 12 ? "AM" : "PM"
    clock_label.text = "%s - %s %s, %s - %s%s" % [wd, m, day, dt.year, str(hour), ampm]

func _on_skip() -> void:
    TimeController.skip_to(TimeController.ingame_datetime)
