<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SlugGeneratorSlugCounters extends Model
{
    protected $fillable = [
        'domain_id',
        'slug_counter',
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
