extends VBoxContainer

@onready var list: VBoxContainer = $List

func _ready() -> void:
    var demo = DemoSeed.new()
    var entries = demo.get_demo_chart_entries()
    var content = demo.get_demo_content()
    for e in entries:
        var row = preload("res://game/ui/ListRow.tscn").instantiate()
        var title = TitleResolver.resolve(content, "en")
        row.set_text(str(e.rank) + "." + title)
        list.add_child(row)
