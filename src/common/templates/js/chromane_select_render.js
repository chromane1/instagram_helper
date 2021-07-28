
		window.chromane_select_render = function () {

			with(this){return _c('div',{staticClass:"chromane-select",class:{ active: model.active },on:{"click":function($event){return handle_event( 'chromane_select_click', { model, event: $event } )}}},[_c('div',{staticClass:"chromane-select-main"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(model.value),expression:"model.value"}],attrs:{"type":"text","placeholder":model.placeholder},domProps:{"value":(model.value)},on:{"input":[function($event){if($event.target.composing)return;$set(model, "value", $event.target.value)},function($event){return handle_event( 'chromane_select_input', { model } )}]}}),_v(" "),_c('svg',{staticClass:"chromane-select-chevron",attrs:{"viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}})])]),_v(" "),_c('div',{staticClass:"chromane-select-options"},[(model.results_available_flag === false)?_c('div',{staticClass:"chromane-select-option chromane-select-option-no-results"},[_v("\n\t\t\t\tNo results found.\n\t\t\t")]):_e(),_v(" "),_l((model.option_data_arr),function(option){return (option.visible)?_c('div',{staticClass:"chromane-select-option",domProps:{"textContent":_s(option.name)},on:{"click":function($event){return handle_event( 'chromane_select_option_click', { model, option, event: $event } )}}}):_e()})],2)])}

		};
	
		window.chromane_select_static_render_fns = function () {

			return [

				

			];

		};
	