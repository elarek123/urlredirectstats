<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'status_id',
        'is_default',
    ];

    public function urls()
    {
        return $this->hasMany(Url::class);
    }

    public function slugGeneratorUrlAvailableSlugs()
    {
        return $this->hasMany(SlugGeneratorUrlAvailableSlug::class);
    }

    public function slugGeneratorSlugCounter()
    {
        return $this->hasOne(SlugGeneratorSlugCounters::class);
    }
}
