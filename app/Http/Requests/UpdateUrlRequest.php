<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUrlRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
                'sometimes',
                'string',
                'max:255',
            ],
            'user_id' => 'sometimes|exists:users,id',
            'domain_id' => 'sometimes|nullable|exists:domains,id',
            'is_active' => 'sometimes|boolean',
            'short_url' => [
                'sometimes',
                'nullable',
                Rule::unique('urls', 'short_url')->ignore($this->url?->id),
                'string',
                'max:255',
            ],
            'redirect_url' => 'sometimes|nullable|string|max:255',
        ];
    }
}
