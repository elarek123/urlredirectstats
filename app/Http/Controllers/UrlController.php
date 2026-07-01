<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnum;
use App\Http\Requests\StoreUrlRequest;
use App\Http\Requests\UpdateUrlRequest;
use App\Models\Domain;
use App\Models\Scan;
use App\Models\Url;
use App\Services\UrlService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UrlController extends Controller
{
    public function __construct(public UrlService $urlService) {}

    public function index()
    {
        return Inertia::render('url', [
            'urls' => Url::query()
                ->with('domain:id,name')
                ->withCount('scans')
                ->orderBy('updated_at', 'desc')
                ->get(),
            'domains' => Domain::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(Url $url)
    {
        $url->load('domain:id,name')->loadCount('scans');

        return Inertia::render('url-detail', [
            'url' => $url,
            'scans' => $url->scans()->latest()->get(),
            'domains' => Domain::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreUrlRequest $request)
    {
        Url::query()->create($request->validated());

        return to_route('urls.index');
    }

    public function update(UpdateUrlRequest $request, Url $url)
    {
        $url->update($request->validated());

        return back();
    }

    public function destroy(Url $url)
    {
        $url->delete();

        return to_route('urls.index');
    }

    public function scan()
    {
        $url = Url::query()->active()->where('short_url', request()->url())->first();
        if (empty($url)) {
            $url = Url::query()->where('short_url', request()->url())->first();
            if (! empty($url)) {
                return response()->json([
                    'name' => $url->name,
                    'redirect_status' => false,
                ]);
            } else {
                return response()->json([
                    'redirect_status' => false,
                ]);
            }
        }
        if (empty($url->redirect_url)) {
            return response()->json([
                'name' => $url->name,
                'redirect_status' => false,
            ]);
        }
        if (empty($url->domain) || $url->domain->status_id == StatusEnum::OFF->value || ! $url->is_active) {
            return response()->json([
                'name' => $url->name,
                'redirect_status' => false,
            ]);
        }

        return redirect(UrlService::scan($url));
    }

    public function slugGenerate(Request $request)
    {
        $domain = Domain::query()->findOrFail($request->validate([
            'domain_id' => 'required|exists:domains,id',
        ])['domain_id']);

        return response()->json([
            'slug' => UrlService::slugGenerate($domain),
        ]);
    }

    public function slugRelease(Request $request)
    {
        $data = $request->validate([
            'domain_id' => 'required|exists:domains,id',
            'slug' => 'required|string',
        ]);

        UrlService::releaseSlug(Domain::query()->find($data['domain_id']), $data['slug']);

        return response()->json(['released' => true]);
    }
}
