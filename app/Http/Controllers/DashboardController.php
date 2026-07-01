<?php

namespace App\Http\Controllers;

use App\Models\Scan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats' => [
                'linksCount' => $user->urls()->count(),
                'allRedirectCount' => Scan::query()->whereIn('scans.url_id', $user->urls()->pluck('id'))->count(),
                'activeLinksCount' => $user->urls()
                    ->active()
                    ->count(),
            ],
        ]);
    }
}
