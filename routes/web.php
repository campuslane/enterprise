<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


// get the consultants from excel spreadsheet
Route::get('consultants', function(){

	header('Access-Control-Allow-Origin: *');

	$file = storage_path() . '/' . 'consultants.xlsx';

	$output = [];
	$columnNames = [];

	// get the column names
	$first = Excel::load($file)->first();

	foreach($first as $column => $value) {
		$columnNames[] = $column;
	}

	$consultants = Excel::load($file)->get();

	$consultants = $consultants->sortBy('last_name');

	$consultants = $consultants->map(function($consultant){

		$consultant = $consultant->toArray();

		if( ! is_array($consultant['sap'])) {
			$consultant['sap'] = [];
		}

		if( $consultant["fi_financial"]) {
		$consultant["sap"][] = "Fi Financial";
		}
		if( $consultant["co_ctrling"]) {
		$consultant["sap"][] = "Co Ctrling";
		}
		if( $consultant["fm_funds_mgmt"]) {
		$consultant["sap"][] = "Fm Funds Mgmt";
		}
		if( $consultant["gm_grants_mgmt"]) {
		$consultant["sap"][] = "Gm Grants Mgmt";
		}
		if( $consultant["am_asset_mgmt"]) {
		$consultant["sap"][] = "Am Asset Mgmt";
		}
		if( $consultant["hr_wfm_human_resources_workforce_mgmt"]) {
		$consultant["sap"][] = "Hr Wfm Human Resources Workforce Mgmt";
		}
		if( $consultant["mm_gfebssc_rm_spending_chain"]) {
		$consultant["sap"][] = "Mm Gfebssc Rm Spending Chain";
		}
		if( $consultant["wm_warehouse_mgmt"]) {
		$consultant["sap"][] = "Wm Warehouse Mgmt";
		}
		if( $consultant["im_inventory_mgmt"]) {
		$consultant["sap"][] = "Im Inventory Mgmt";
		}
		if( $consultant["ewm_ewms"]) {
		$consultant["sap"][] = "Ewm Ewms";
		}
		if( $consultant["eh_s_envir_health_safety"]) {
		$consultant["sap"][] = "Eh S Envir Health Safety";
		}
		if( $consultant["sd_sales_dist"]) {
		$consultant["sap"][] = "Sd Sales Dist";
		}
		if( $consultant["ps_proj_sys"]) {
		$consultant["sap"][] = "Ps Proj Sys";
		}
		if( $consultant["pp_prod_planning"]) {
		$consultant["sap"][] = "Pp Prod Planning";
		}
		if( $consultant["pm_plant_maint"]) {
		$consultant["sap"][] = "Pm Plant Maint";
		}
		if( $consultant["ppe_rp_reetc_real_property_equip_real_estate"]) {
		$consultant["sap"][] = "Ppe Rp Reetc Real Property Equip Real Estate";
		}
		if( $consultant["qa_qmquality_assurance_mgmt"]) {
		$consultant["sap"][] = "Qa Qmquality Assurance Mgmt";
		}
		if( $consultant["apo_supply_chain"]) {
		$consultant["sap"][] = "Apo Supply Chain";
		}
		if( $consultant["sas"]) {
		$consultant["sap"][] = "Sas";
		}
		if( $consultant["training"]) {
		$consultant["sap"][] = "Training";
		}
		if( $consultant["bw_bi_biz_warehouse_biz_intelligence"]) {
		$consultant["sap"][] = "Bw Bi Biz Warehouse Biz Intelligence";
		}
		if( $consultant["abap"]) {
		$consultant["sap"][] = "Abap";
		}
		if( $consultant["netweaver"]) {
		$consultant["sap"][] = "Netweaver";
		}
		if( $consultant["data"]) {
		$consultant["sap"][] = "Data";
		}
		if( $consultant["workflow"]) {
		$consultant["sap"][] = "Workflow";
		}
		if( $consultant["basis"]) {
		$consultant["sap"][] = "Basis";
		}
		if( $consultant["hana"]) {
		$consultant["sap"][] = "Hana";
		}
		if( $consultant["bobj"]) {
		$consultant["sap"][] = "Bobj";
		}
		if( $consultant["pi"]) {
		$consultant["sap"][] = "Pi";
		}
		if( $consultant["data_warehousing"]) {
		$consultant["sap"][] = "Data Warehousing";
		}
		if( $consultant["data_migration"]) {
		$consultant["sap"][] = "Data Migration";
		}
		if( $consultant["data_management"]) {
		$consultant["sap"][] = "Data Management";
		}
		if( $consultant["business_processes"]) {
		$consultant["sap"][] = "Business Processes";
		}
		if( $consultant["security"]) {
		$consultant["sap"][] = "Security";
		}

		unset($consultant['fi_financial']);
		unset($consultant['co_ctrling']);
		unset($consultant['fm_funds_mgmt']);
		unset($consultant['gm_grants_mgmt']);
		
		return $consultant;

	});

	$output = [];

	$i=0;

	foreach($consultants as $consultant) {
		if($i > 500) {
			break;
		} else {
			$output[] = $consultant;
		}

		$i++;
	}

	return json_encode($output);


});



Route::get('import', function(){

	$file = storage_path() . '/' . 'consultants.xlsx';

	$output = [];
	$columnNames = [];

	// get the column names
	$first = Excel::load($file)->first();

	foreach($first as $column => $value) {
		$columnNames[] = $column;
	}

	//dd($columnNames);
	
	$consultants = Excel::load($file)->get();

	// foreach($consultants as $consultant) {

	// 	

	// 	if( $consultant['fi_financial']) [
	// 		$consultant->sap .= 'Fi - Financial|';
	// 	];

	// }

	$consultants = $consultants->map(function($consultant){

		$consultant = $consultant->toArray();

		if( ! is_array($consultant['sap'])) {
			$consultant['sap'] = [];
		}

		if( $consultant["fi_financial"]) {
		$consultant["sap"][] = "Fi Financial";
		}
		if( $consultant["co_ctrling"]) {
		$consultant["sap"][] = "Co Ctrling";
		}
		if( $consultant["fm_funds_mgmt"]) {
		$consultant["sap"][] = "Fm Funds Mgmt";
		}
		if( $consultant["gm_grants_mgmt"]) {
		$consultant["sap"][] = "Gm Grants Mgmt";
		}
		if( $consultant["am_asset_mgmt"]) {
		$consultant["sap"][] = "Am Asset Mgmt";
		}
		if( $consultant["hr_wfm_human_resources_workforce_mgmt"]) {
		$consultant["sap"][] = "Hr Wfm Human Resources Workforce Mgmt";
		}
		if( $consultant["mm_gfebssc_rm_spending_chain"]) {
		$consultant["sap"][] = "Mm Gfebssc Rm Spending Chain";
		}
		if( $consultant["wm_warehouse_mgmt"]) {
		$consultant["sap"][] = "Wm Warehouse Mgmt";
		}
		if( $consultant["im_inventory_mgmt"]) {
		$consultant["sap"][] = "Im Inventory Mgmt";
		}
		if( $consultant["ewm_ewms"]) {
		$consultant["sap"][] = "Ewm Ewms";
		}
		if( $consultant["eh_s_envir_health_safety"]) {
		$consultant["sap"][] = "Eh S Envir Health Safety";
		}
		if( $consultant["sd_sales_dist"]) {
		$consultant["sap"][] = "Sd Sales Dist";
		}
		if( $consultant["ps_proj_sys"]) {
		$consultant["sap"][] = "Ps Proj Sys";
		}
		if( $consultant["pp_prod_planning"]) {
		$consultant["sap"][] = "Pp Prod Planning";
		}
		if( $consultant["pm_plant_maint"]) {
		$consultant["sap"][] = "Pm Plant Maint";
		}
		if( $consultant["ppe_rp_reetc_real_property_equip_real_estate"]) {
		$consultant["sap"][] = "Ppe Rp Reetc Real Property Equip Real Estate";
		}
		if( $consultant["qa_qmquality_assurance_mgmt"]) {
		$consultant["sap"][] = "Qa Qmquality Assurance Mgmt";
		}
		if( $consultant["apo_supply_chain"]) {
		$consultant["sap"][] = "Apo Supply Chain";
		}
		if( $consultant["sas"]) {
		$consultant["sap"][] = "Sas";
		}
		if( $consultant["training"]) {
		$consultant["sap"][] = "Training";
		}
		if( $consultant["bw_bi_biz_warehouse_biz_intelligence"]) {
		$consultant["sap"][] = "Bw Bi Biz Warehouse Biz Intelligence";
		}
		if( $consultant["abap"]) {
		$consultant["sap"][] = "Abap";
		}
		if( $consultant["netweaver"]) {
		$consultant["sap"][] = "Netweaver";
		}
		if( $consultant["data"]) {
		$consultant["sap"][] = "Data";
		}
		if( $consultant["workflow"]) {
		$consultant["sap"][] = "Workflow";
		}
		if( $consultant["basis"]) {
		$consultant["sap"][] = "Basis";
		}
		if( $consultant["hana"]) {
		$consultant["sap"][] = "Hana";
		}
		if( $consultant["bobj"]) {
		$consultant["sap"][] = "Bobj";
		}
		if( $consultant["pi"]) {
		$consultant["sap"][] = "Pi";
		}
		if( $consultant["data_warehousing"]) {
		$consultant["sap"][] = "Data Warehousing";
		}
		if( $consultant["data_migration"]) {
		$consultant["sap"][] = "Data Migration";
		}
		if( $consultant["data_management"]) {
		$consultant["sap"][] = "Data Management";
		}
		if( $consultant["business_processes"]) {
		$consultant["sap"][] = "Business Processes";
		}
		if( $consultant["security"]) {
		$consultant["sap"][] = "Security";
		}

		unset($consultant['fi_financial']);
		unset($consultant['co_ctrling']);
		unset($consultant['fm_funds_mgmt']);
		unset($consultant['gm_grants_mgmt']);
		
		return $consultant;

	});

	$output = [];

	$i=0;

	foreach($consultants as $consultant) {

		if($i > 2000) {
			break;
		} else {
			$output[] = $consultant;
		}

		$i++;
	}

	return json_encode($output);



	

	
});

Route::get('names', function(){

	$file = storage_path() . '/' . 'consultants.xlsx';

	$fields = [];

	// get the column names
	$first = Excel::load($file)->first();

	foreach($first as $field => $value) {
		$label = ucwords(str_replace('_', ' ', $field));

		echo 'if( $consultant["' . $field . '"]) {';
		echo '<br>';
		echo '$consultant["sap"][] = "' . $label . '";';
		echo '<br>';
		echo '}';
		echo "<br>";
	
	}



	
});

Route::get('vue', function () {
    return view('vue');
});

