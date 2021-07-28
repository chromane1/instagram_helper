
		window.chromane_table_render = function () {

			with(this){return _c('div',{staticClass:"chromane_table"},[_c('div',{staticClass:"chromane_table-main_row"},_l((model.main_row_cell_arr),function(item){return _c('div',{staticClass:"chromane_table-main_row-cell",style:({width : model.table_row_width + '%'}),domProps:{"textContent":_s(item.title)}})}),0),_v(" "),_l((model.row_arr),function(row){return _c('div',{staticClass:"chromane_table-row"},_l((row),function(cell){return _c('div',{staticClass:"chromane_table-row-cell",style:({width : model.table_row_width + '%'})},[(cell.type ==='text')?_c('div',{domProps:{"textContent":_s(cell.value)}}):_e(),_v(" "),(cell.type ==='image')?_c('div',[_c('img',{attrs:{"src":cell.value}})]):_e()])}),0)})],2)}

		};
	
		window.chromane_table_static_render_fns = function () {

			return [

				

			];

		};
	