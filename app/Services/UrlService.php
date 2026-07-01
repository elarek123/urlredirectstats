<?php

namespace App\Services;

use App\Models\Domain;
use App\Models\Url;


class UrlService
{
    public static string $stringForEncode = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    public static function compare(Url $url)
    {
        $slug = last(explode('/', $url->short_url));
        $availableSlugRecord = $url->domain?->slugGeneratorUrlAvailableSlugs()->where('available_slug', $slug)->first();
        if (! empty($availableSlugRecord)) {
            $availableSlug = $availableSlugRecord->available_slug;
            $availableSlugRecord->delete();
        }
    }

    public static function slugGenerate(Domain $domain)
    {
        $availableSlugRecord = $domain->slugGeneratorUrlAvailableSlugs()->where('is_used', false)->first();
        if (empty($availableSlugRecord)) {
            $slugCounter = $domain->slugGeneratorSlugCounter()->first();
            if (empty($slugCounter)) {
                $availableSlug = self::encode();
                $domain->slugGeneratorUrlAvailableSlugs()->create(['available_slug' => $availableSlug, 'is_used' => true]);
                $domain->slugGeneratorSlugCounter()->create(['slug_counter' => self::encode(self::counterIncrement($availableSlug))]);
            } else {
                $availableSlug = $slugCounter->slug_counter;
                $domain->slugGeneratorUrlAvailableSlugs()->create(['available_slug' => $availableSlug, 'is_used' => true]);
                $domain->slugGeneratorSlugCounter()->create(['slug_counter' => self::encode(self::counterIncrement($availableSlug))]);
                $slugCounter->delete();
            }

        } else {
            $availableSlugRecord->update(['is_used' => 1]);
            $availableSlug = $availableSlugRecord->available_slug;
        }

        return $availableSlug;
    }

    public static function releaseSlug(Domain $domain, string $slug): void
    {
        $domain->slugGeneratorUrlAvailableSlugs()
            ->where('available_slug', $slug)
            ->where('is_used', true)
            ->update(['is_used' => false]);
    }

    public static function counterIncrement($slug)
    {
        $field = self::decode($slug);
        $curCounter = strrev($field);
        $newCounter = '';
        $carry = 1;
        for ($i = 0; $i < 12; $i += 2) {
            $pair = (int) $curCounter[$i] + (int) $curCounter[$i + 1] * 10;

            $pair += $carry;
            if ($pair >= 62) {
                $pair = 0;
                $carry = 1;
            } else {
                $carry = 0;
            }
            $pair = (string) $pair;
            if (strlen($pair) == 1) {
                $pair = '0'.$pair;
            }
            $newCounter .= strrev($pair);

        }

        return strrev($newCounter);
    }

    public static function encode($field = '000000000000')
    {

        $slug = '';
        for ($i = 0; $i < 12; $i += 2) {
            $symbolIndex = $field[$i] * 10 + $field[$i + 1];
            $symbol = self::$stringForEncode[$symbolIndex];
            $slug .= $symbol;
        }

        return $slug;
    }

    public static function decode($slug)
    {
        $field = '';
        for ($i = 0; $i < strlen($slug); $i++) {
            $index = strpos(self::$stringForEncode, $slug[$i]);
            $index = (string) $index;
            if (strlen($index) == 1) {
                $index = '0'.$index;
            }
            $field .= $index;
        }

        return $field;
    }

    public static function scan(Url $url)
    {
        $url->scans()->create([
            'user_ip' => request()->ip(),
        ]);

        return $url->redirect_url;
    }

}
