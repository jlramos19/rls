extends VBoxContainer

@onready var weeks: VBoxContainer = $Weeks
@onready var open_btn: Button = $Open

func _ready() -> void:
    for i in range(4):
        weeks.add_child(Label.new())
        weeks.get_child(i).text = "Week %d" % (i+1)
    open_btn.text = "Open"
    open_btn.pressed.connect(_on_open)

func _on_open() -> void:
    # stub
    pass
