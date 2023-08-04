<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orderColumn = request('order_column', 'id');
        if (!in_array($orderColumn, ['id', 'first_name', 'created_at'])) {
            $orderColumn = 'id';
        }
        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }
        $employees = Employee::with('company')
            ->when(request('search_category'), function ($query) {
                $query->where('company_id', request('search_company'));
            })
            ->when(request('search_id'), function ($query) {
                $query->where('id', request('search_id'));
            })
            ->when(request('search_first_name'), function ($query) {
                $query->where('title', 'like', '%'.request('search_first_name').'%');
            })
            ->when(request('search_last_name'), function ($query) {
                $query->where('content', 'like', '%'.request('search_last_name').'%');
            })
            ->when(request('search_global'), function ($query) {
                $query->where(function($q) {
                    $q->where('id', request('search_global'))
                        ->orWhere('first_name', 'like', '%'.request('search_global').'%')
                        ->orWhere('last_name', 'like', '%'.request('search_global').'%')
                        ->orWhere('email', 'like', '%'.request('search_global').'%')
                        ->orWhere('phone', 'like', '%'.request('search_global').'%')
                        ->orWhere('id', 'like', '%'.request('search_global').'%');
                });
            })
            ->orderBy($orderColumn, $orderDirection)
            ->paginate(10);
        return EmployeeResource::collection($employees);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreEmployeeRequest $request)
    {
        $this->authorize('employee-create');
        $employee = Employee::create($request->validated());

        return new EmployeeResource($employee);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $employee)
    {
        $this->authorize('employee-edit');
        return new EmployeeResource($employee);
    
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Employee $employee,StoreEmployeeRequest $request)
    {
        $this->authorize('employee-edit');
        $employee->update($request->validated());

        return new EmployeeResource($employee);
    
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Employee $employee)
    {
        $this->authorize('employee-delete');
        $employee->delete();

        return response()->noContent();
    
    }
}
