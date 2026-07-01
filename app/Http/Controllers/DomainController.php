<?php

namespace App\Http\Controllers;

use App\Enums\StatusEnum;
use App\Http\Requests\StoreDomainRequest;
use App\Http\Requests\UpdateDomainRequest;
use App\Models\Domain;
use Inertia\Inertia;

class DomainController extends Controller
{
    public function index()
    {
        return Inertia::render('domain', [
            'domains' => Domain::query()->orderBy('updated_at', 'desc')->get(),
            'statuses' => StatusEnum::toSelectList(),
        ]);
    }

    public function store(StoreDomainRequest $request)
    {
        $data = $request->validated();

        if (! empty($data['is_default'])) {
            Domain::query()->where('is_default', true)->update(['is_default' => false]);
        }

        Domain::query()->create($data);

        return to_route('domains.index');
    }

    public function update(UpdateDomainRequest $request, Domain $domain)
    {
        $data = $request->validated();

        if (! empty($data['is_default'])) {
            Domain::query()->where('is_default', true)->update(['is_default' => false]);
        }


        $domain->update($data);

        return to_route('domains.index');
    }

    public function destroy(Domain $domain)
    {
        if ($domain->urls()->count() > 0) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Нельзя удалить домен со ссылками',
            ]);
        }

        $domain->delete();

        return to_route('domains.index');
    }
}
