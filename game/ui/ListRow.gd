extends HBoxContainer

@onready var icon: TextureRect = $Icon
@onready var primary: Label = $VBox/Primary
@onready var secondary: Label = $VBox/Secondary
@onready var action: Button = $Action

func set_text(p: String, s: String="") -> void:
    primary.text = p
    secondary.text = s
