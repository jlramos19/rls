extends Node

func resolve(content: Dictionary, viewer_locale: String) -> String:
    var titles: Dictionary = content.get("titles", {})
    var locales = [viewer_locale, viewer_locale.split("_")[0], "en", "es", "ko"]
    for loc in locales:
        if titles.has(loc):
            return titles[loc]
    return "<untitled>"

func validate_korean_hangul_only(title: String) -> bool:
    if title.is_empty():
        return false
    for c in title:
        var code = int(c.ord())
        if code < 0xAC00 or code > 0xD7AF:
            return false
    return true
