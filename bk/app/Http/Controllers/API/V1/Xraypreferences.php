<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\XraypreferenceResource;

use App\Models\XrayCategory;
use App\Models\Xraypreference;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Xraypreferences extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Eager-load xray_category relationship
            $xrays = Xraypreference::get();
            return XraypreferenceResource::collection($xrays);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error fetching X-ray preferences: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch X-rays',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            $xrayPreference = Xraypreference::withTrashed()
                ->where('xray_name', $request->xray_name)
                ->first();

            if ($xrayPreference && $xrayPreference->trashed()) {
                // Restore the soft-deleted record
                $xrayPreference->restore();

                // Update price if provided in the request
                $newPrice = $request->input('price');
                if ($newPrice) {
                    $xrayPreference->update(['price' => $newPrice]);
                }

                return $this->success(
                    new XraypreferenceResource($xrayPreference),
                    'X-ray preference restored successfully',
                    200
                );
            }

            // Validate the request data
            $validated = $request->validate([
                'xray_name' => 'required|unique:xraypreferences,xray_name,NULL,id,deleted_at,NULL',


                'price' => 'required|numeric|min:0',
            ]);
            Log::info($request->all());
            // Create a new X-ray preference
            $xray = Xraypreference::create($validated);

            // Return the newly created resource
            return $this->success(
                new XraypreferenceResource($xray),
                'X-ray preference created successfully',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return $this->error(
                'Failed to create X-ray preference',
                $e->getMessage(),
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $xray = Xraypreference::findOrFail($id);
            $xray->delete();
            return $this->success(null, 'X-ray preference deleted successfully', 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('X-ray preference not found', 'error', 404);
        } catch (\Exception $e) {
            return $this->error('Failed to delete X-ray preference', 'error', 500);
        }
    }
}
