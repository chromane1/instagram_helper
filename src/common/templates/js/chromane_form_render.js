
		window.chromane_form_render = function () {

			with(this){return _c('div',{staticClass:"chromane_form"},_l((model.form_item_model_arr),function(item_model){return _c('div',{staticClass:"chromane_form_item"},[_c('div',{staticClass:"chromane_form_item-title",domProps:{"textContent":_s(item_model.title)}}),_v(" "),(item_model.type === 'text_input')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(item_model.value),expression:"item_model.value"}],staticClass:"chromane_form_item-input",attrs:{"type":"text"},domProps:{"value":(item_model.value)},on:{"input":function($event){if($event.target.composing)return;$set(item_model, "value", $event.target.value)}}}):_e(),_v(" "),(item_model.type === 'password')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(item_model.value),expression:"item_model.value"}],staticClass:"chromane_form_item-input",attrs:{"type":"password"},domProps:{"value":(item_model.value)},on:{"input":function($event){if($event.target.composing)return;$set(item_model, "value", $event.target.value)}}}):_e(),_v(" "),(item_model.type === 'disabled_text_input')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(item_model.value),expression:"item_model.value"}],staticClass:"chromane_form_item-input",attrs:{"type":"text","disabled":""},domProps:{"value":(item_model.value)},on:{"input":function($event){if($event.target.composing)return;$set(item_model, "value", $event.target.value)}}}):_e(),_v(" "),(item_model.type === 'number_input')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(item_model.value),expression:"item_model.value"}],staticClass:"chromane_form_item-input",attrs:{"type":"number"},domProps:{"value":(item_model.value)},on:{"input":function($event){if($event.target.composing)return;$set(item_model, "value", $event.target.value)}}}):_e(),_v(" "),(item_model.type === 'html_editor')?_c('div',{staticClass:"chromane_html_editor",attrs:{"data-name":item_model.name}}):_e(),_v(" "),(item_model.type === 'chromane_select')?_c("chromane_select",{tag:"div",attrs:{"model":item_model.chromane_select_model}}):_e(),_v(" "),(item_model.validity === 'invalid')?_c('div',{staticClass:"chromane_form_item-error_message",domProps:{"textContent":_s(item_model.message)}}):_e()],1)}),0)}

		};
	
		window.chromane_form_static_render_fns = function () {

			return [

				

			];

		};
	