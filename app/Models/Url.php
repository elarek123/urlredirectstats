<?php

namespace App\Models;

use App\Observers\UrlObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

#[ObservedBy(UrlObserver::class)]
class Url extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        'domain_id',
        'is_active',
        'short_url',
        'redirect_url',
    ];

    public function getColumns($value = [])
    {
        $data = Schema::getColumnListing('urls');

        return array_merge($data, $value);
    }

    #[Scope]
    public function exclude(Builder $query, $value = [], $with = []): Builder
    {
        return $query->select(array_diff($this->getColumns($with), $value));
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }

    public function scans()
    {
        return $this->hasMany(Scan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    #[Scope]
    public function active(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
