extends PanelContainer

signal resized
signal collapsed_changed(collapsed: bool)

@onready var toggle: Button = $VBox/Header/Toggle
@onready var content: Control = $VBox/Content
var collapsed: bool = false
var _drag_origin: Vector2
var _orig_size: Vector2

func _ready() -> void:
    toggle.pressed.connect(_on_toggle)
    set_process_unhandled_input(true)

func _on_toggle() -> void:
    collapsed = !collapsed
    content.visible = !collapsed
    collapsed_changed.emit(collapsed)

func _gui_input(event: InputEvent) -> void:
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed:
            _drag_origin = get_global_mouse_position()
            _orig_size = size
        else:
            _drag_origin = Vector2.ZERO
    elif event is InputEventMouseMotion and _drag_origin != Vector2.ZERO:
        var diff = get_global_mouse_position() - _drag_origin
        size = (_orig_size + diff).snapped(Vector2(12,12))
        resized.emit()
