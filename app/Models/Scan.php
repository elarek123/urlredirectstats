<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{
    protected $fillable = [
        'url_id',
        'user_ip',
    ];

    public function url()
    {
        return $this->belongsTo(Url::class);
    }
}
