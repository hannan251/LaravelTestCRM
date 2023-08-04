<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Mail;
use App\Mail\WelcomeMail;

class CompanyController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orderColumn = request('order_column', 'id');
        if (!in_array($orderColumn, ['id', 'name', 'created_at'])) {
            $orderColumn = 'id';
        }
        $orderDirection = request('order_direction', 'desc');
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }
        $companies = Company::when(request('search_id'), function ($query) {
            $query->where('id', request('search_id'));
        })
        ->when(request('search_title'), function ($query) {
            $query->where('name', 'like', '%'.request('search_title').'%');
        })
        ->when(request('search_global'), function ($query) {
            $query->where(function($q) {
                $q->where('id', request('search_global'))
                    ->orWhere('name', 'like', '%'.request('search_global').'%');

            });
        })
        ->orderBy($orderColumn, $orderDirection)
        ->paginate(10);
        return CompanyResource::collection($companies);
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
    public function store(StoreCompanyRequest $request)
    {
        $this->authorize('company-create');
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = $file->getClientOriginalName();
            $file->storeAs('public/',$filename);    
        }

        $data = [ 
                'name' => $request->name,
                'email' => $request->email,
                'website' => $request->website,
                'logo' => $filename
                ];
        $company = Company::create($data);
        if($company){
            $mailData = [
                'title' => 'Mail from Laravel.com',
                'body' => 'This is a Welcome Email.'
            ];
             
            Mail::to($request->email)->send(new WelcomeMail($mailData));    
        }

        return new CompanyResource($company);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        $this->authorize('company-edit');
        return new CompanyResource($company);
    
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
    public function update(Company $company, StoreCompanyRequest $request)
    {
        $this->authorize('company-edit');
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = $file->getClientOriginalName();
            $file->storeAs('public/',$filename);    
        }

        $data = [ 
                'name' => $request->name,
                'email' => $request->email,
                'website' => $request->website,
                'logo' => $filename
                ];
        
        $company->update($data);

        return new CompanyResource($company);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Company $company)
    {
        $this->authorize('company-delete');
        $company->delete();

        return response()->noContent();
    
    }

    public function getList()
    {
        return CompanyResource::collection(Company::all());
    }
}
