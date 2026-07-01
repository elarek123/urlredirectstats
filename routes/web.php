<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::apiResource('domains', \App\Http\Controllers\DomainController::class);
    Route::post('urls/slug-generate', [\App\Http\Controllers\UrlController::class, 'slugGenerate'])->name('urls.slug-generate');
    Route::post('urls/slug-release', [\App\Http\Controllers\UrlController::class, 'slugRelease'])->name('urls.slug-release');
    Route::apiResource('urls', \App\Http\Controllers\UrlController::class);
    Route::get('/{slug}', [\App\Http\Controllers\UrlController::class, 'scan'])->name('urls.scan');
});

require __DIR__.'/settings.php';
