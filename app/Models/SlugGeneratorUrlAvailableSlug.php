<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SlugGeneratorUrlAvailableSlug extends Model
{
    protected $fillable = [
        'domain_id',
        'available_slug',
        'is_used',
    ];

    protected $casts = [
        'is_used' => 'boolean',
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
