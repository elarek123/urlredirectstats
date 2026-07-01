<?php

namespace App\Filament\Resources\Urls\Schemas;

use App\Enums\StatusEnum;
use App\Models\Domain;
use App\Models\Url;
use App\Services\UrlService;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Schema;

class UrlForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Название')
                    ->required(),
                Select::make('domain_id')
                    ->default(function () {
                        $domain_id = Domain::query()->where('domains.is_default', true)->where('domains.status_id', StatusEnum::ON->value)->first()?->id;
                        return $domain_id;
                    })
                    ->label('Домен')
                    ->relationship('domain', 'name')
                    ->disabled(function ($livewire) {
                        return $livewire instanceof EditRecord;
                    }),
                Select::make('user_id')
                    ->label('Пользователь')
                    ->relationship('user', 'name')
                    ->required()
                    ->default(function () {
                        return auth()->user()->id;
                    }),

                Toggle::make('is_active')
                    ->label('Активен')
                    ->default(true),

                TextInput::make('slug')
                    ->label('Короткая ссылка')
                    ->prefix(function ($get) {
                        $domain = Domain::find($get('domain_id'));
                        $slash = is_null($domain) or $domain->name[-1] == '/' ? '' : '/';
                        return $domain ? $domain->name . $slash : null;
                    })
                    ->live()
                    ->disabled(function ($livewire) {
                        return $livewire instanceof EditRecord;
                    })
                    ->suffixAction(function ($livewire) {
                        $action = Action::make('generateSlug')
                            ->icon('heroicon-o-sparkles')
                            ->tooltip('Сгенерировать')
                            ->disabled(function ($livewire) {
                                return $livewire instanceof EditRecord;
                            })
                            ->action(function ($set, $get, $livewire) {
                                $domainId = $get('domain_id');

                                if (empty($domainId)) {
                                    Notification::make()
                                        ->title('Сначала выберите домен')
                                        ->warning()
                                        ->send();

                                    return;
                                }

                                $domain = Domain::find($domainId);

                                if (empty($domain)) {
                                    Notification::make()
                                        ->title('Домен не найден')
                                        ->danger()
                                        ->send();

                                    return;
                                }

                                $previousSlug = $get('slug');

                                if (!empty($previousSlug)) {
                                    UrlService::releaseSlug($domain, $previousSlug);
                                }

                                $slug = UrlService::slugGenerate($domain);

                                $set('slug', $slug);
                                $livewire->dispatch('slug-reserved', domainId: (string)$domainId, slug: $slug);
                            });
                        return $action;
                    })
                    ->required()
                    ->formatStateUsing(function (?Url $record) {
                        if (!$record) {
                            return null;
                        }

                        $pos = strrpos($record->short_url, '/');

                        return $pos === false
                            ? $record->short_url
                            : substr($record->short_url, $pos + 1);
                    }),

                TextInput::make('short_url')
                    ->hidden()
                    ->dehydrated(false),

                TextInput::make('redirect_url')
                    ->label('Ссылка для перехода'),
            ]);
    }
}
