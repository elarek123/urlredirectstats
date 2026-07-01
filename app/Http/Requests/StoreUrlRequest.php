<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUrlRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => $this->user()?->id,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'user_id' => 'required|exists:users,id',
            'domain_id' => 'required|exists:domains,id',
            'short_url' => [
                'required',
                'string',
                'max:255',
                Rule::unique('urls', 'short_url'),
            ],
            'is_active' => 'sometimes|boolean',
            'redirect_url' => 'nullable|string|max:255',
        ];
    }
}
