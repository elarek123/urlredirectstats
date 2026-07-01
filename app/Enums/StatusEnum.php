<?php

namespace App\Enums;

enum StatusEnum: int
{
    case OFF = 0;
    case ON = 1;

    public static function toArray(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    public function labelAttribute(): string
    {
        return match ($this) {
            self::OFF => 'Выключен',
            self::ON => 'Включен',
        };
    }

    public static function toSelectList(): array
    {
        return array_combine(self::toArray(), array_map(fn ($val) => self::from($val)->labelAttribute(), self::toArray()));
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
