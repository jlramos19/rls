extends Node

func get_demo_content() -> Dictionary:
    return {
        "id": 1,
        "type": "single",
        "canonical_country": "KR",
        "canonical_locale": "ko",
        "titles": {"ko": "버터", "en": "Butter"}
    }

func get_demo_chart_entries() -> Array:
    var arr: Array[ChartEntry] = []
    for i in range(10):
        var ce := ChartEntry.new()
        ce.week = 1
        ce.content_id = 1
        ce.rank = i + 1
        ce.status_flags = 0
        arr.append(ce)
    return arr
