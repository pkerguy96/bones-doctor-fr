<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class XraypreferenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {


        return [
            "id" => $this->id,
            "category" => $this->xray_category?->name, // Safely access name
            "xray_type" => $this->xray_type,
            "price" => $this->price,
        ];
    }
}
