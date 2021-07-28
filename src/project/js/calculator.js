
	function calculator ( app ) {

		return {

			parse_input_data: ( data, exec ) => {

				var parsed_data = {

					slection_data_arr: [],

				};

				var total_stake = data.line_stake * 30;

				data.selection_data_arr.forEach( ( data ) => {

					var new_data = {};

					new_data.fair_win_win = 1 / data.lay_win;
					new_data.fair_lose_win = 1 - new_data.fair_win_win;
					new_data.fair_odds_win = data.lay_win;
					new_data.ev_win = data.back_win / new_data.fair_odds_win;

					parsed_data.selection_data_arr.push( new_data );

				});	

				var vars = {};

				vars.selectionABackWIN = data.selection_data_arr[ 0 ].back_win;
				vars.selectionBBackWIN = data.selection_data_arr[ 1 ].back_win;
				vars.selectionCBackWIN = data.selection_data_arr[ 2 ].back_win;
				vars.selectionDBackWIN = data.selection_data_arr[ 3 ].back_win;

				vars.selectionALayWIN = data.selection_data_arr[ 0 ].lay_win;
				vars.selectionBLayWIN = data.selection_data_arr[ 1 ].lay_win;
				vars.selectionCLayWIN = data.selection_data_arr[ 2 ].lay_win;
				vars.selectionDLayWIN = data.selection_data_arr[ 3 ].lay_win;

				vars.selectionABackPLACE = data.selection_data_arr[ 0 ].back_place;
				vars.selectionBBackPLACE = data.selection_data_arr[ 1 ].back_place;
				vars.selectionCBackPLACE = data.selection_data_arr[ 2 ].back_place;
				vars.selectionDBackPLACE = data.selection_data_arr[ 3 ].back_place;

				vars.selectionALayPLACE = data.selection_data_arr[ 0 ].lay_place;
				vars.selectionBLayPLACE = data.selection_data_arr[ 1 ].lay_place;
				vars.selectionCLayPLACE = data.selection_data_arr[ 2 ].lay_place;
				vars.selectionDLayPLACE = data.selection_data_arr[ 3 ].lay_place;

				vars.selectionAFairWinWIN =					1/vars.selectionALayWIN;
				vars.selectionBFairWinWIN =					1/vars.selectionBLayWIN;
				vars.selectionCFairWinWIN =					1/vars.selectionCLayWIN;
				vars.selectionDFairWinWIN =					1/vars.selectionDLayWIN;
								
				vars.selectionAFairLoseWIN =				1 - vars.selectionAFairWinWIN;	
				vars.selectionBFairLoseWIN =				1 - vars.selectionBFairWinWIN;	
				vars.selectionCFairLoseWIN =				1 - vars.selectionCFairWinWIN;	
				vars.selectionDFairLoseWIN =				1 - vars.selectionDFairWinWIN;	
								
				vars.selectionAFairOddsWIN = 				1/vars.selectionAFairWinWIN;	
				vars.selectionBFairOddsWIN = 				1/vars.selectionBFairWinWIN;	
				vars.selectionCFairOddsWIN = 				1/vars.selectionCFairWinWIN;	
				vars.selectionDFairOddsWIN = 				1/vars.selectionDFairWinWIN;	
				
				vars.selectionAEVWIN =				vars.selectionABackWIN/vars.selectionAFairOddsWIN;	
				vars.selectionBEVWIN =				vars.selectionBBackWIN/vars.selectionBFairOddsWIN;	
				vars.selectionCEVWIN =				vars.selectionCBackWIN/vars.selectionCFairOddsWIN;	
				vars.selectionDEVWIN =				vars.selectionDBackWIN/vars.selectionDFairOddsWIN;	

				vars.probLoseWIN =					vars.selectionAFairLoseWIN * vars.selectionBFairLoseWIN * vars.selectionCFairLoseWIN * vars.selectionDFairLoseWIN;				
				vars.probAWIN =						vars.selectionAFairWinWIN * vars.selectionBFairLoseWIN * vars.selectionCFairLoseWIN * vars.selectionDFairLoseWIN;				
				vars.probBWIN =						vars.selectionAFairLoseWIN * vars.selectionBFairWinWIN * vars.selectionCFairLoseWIN * vars.selectionDFairLoseWIN;				
				vars.probCWIN =						vars.selectionAFairLoseWIN * vars.selectionBFairLoseWIN * vars.selectionCFairWinWIN * vars.selectionDFairLoseWIN;				
				vars.probDWIN =						vars.selectionAFairLoseWIN * vars.selectionBFairLoseWIN * vars.selectionCFairLoseWIN * vars.selectionDFairWinWIN;				
				vars.probABWIN =					vars.selectionAFairWinWIN * vars.selectionBFairWinWIN * vars.selectionCFairLoseWIN * vars.selectionDFairLoseWIN;				
				vars.probACWIN =					vars.selectionAFairWinWIN * vars.selectionBFairLoseWIN * vars.selectionCFairWinWIN * vars.selectionDFairLoseWIN;				
				vars.probADWIN =					vars.selectionAFairWinWIN * vars.selectionBFairLoseWIN * vars.selectionCFairLoseWIN * vars.selectionDFairWinWIN;				
				vars.probBCWIN =					vars.selectionAFairLoseWIN * vars.selectionBFairWinWIN * vars.selectionCFairWinWIN * vars.selectionDFairLoseWIN;				
				vars.probBDWIN =					vars.selectionAFairLoseWIN * vars.selectionBFairWinWIN * vars.selectionCFairLoseWIN * vars.selectionDFairWinWIN;				
				vars.probCDWIN =					vars.selectionAFairLoseWIN * vars.selectionBFairLoseWIN * vars.selectionCFairWinWIN * vars.selectionDFairWinWIN;				
				vars.probABCWIN =					vars.selectionAFairWinWIN * vars.selectionBFairWinWIN * vars.selectionCFairWinWIN * vars.selectionDFairLoseWIN;				
				vars.probABDWIN =					vars.selectionAFairWinWIN * vars.selectionBFairWinWIN * vars.selectionCFairLoseWIN * vars.selectionDFairWinWIN;				
				vars.probACDWIN =					vars.selectionAFairWinWIN * vars.selectionBFairLoseWIN * vars.selectionCFairWinWIN * vars.selectionDFairWinWIN;				
				vars.probBCDWIN =					vars.selectionAFairLoseWIN * vars.selectionBFairWinWIN * vars.selectionCFairWinWIN * vars.selectionDFairWinWIN;				
				vars.probABCDWIN =					vars.selectionAFairWinWIN * vars.selectionBFairWinWIN * vars.selectionCFairWinWIN * vars.selectionDFairWinWIN;			

				vars.probLoseOddsWIN = 				1/vars.probLoseWIN;
				vars.probAOddsWIN = 				1/vars.probAWIN;
				vars.probBOddsWIN = 				1/vars.probBWIN;
				vars.probCOddsWIN = 				1/vars.probCWIN;
				vars.probDOddsWIN = 				1/vars.probDWIN;
				vars.probABOddsWIN = 				1/vars.probABWIN;
				vars.probACOddsWIN = 				1/vars.probACWIN;
				vars.probADOddsWIN = 				1/vars.probADWIN;
				vars.probBCOddsWIN = 				1/vars.probBCWIN;
				vars.probBDOddsWIN = 				1/vars.probBDWIN;
				vars.probCDOddsWIN = 				1/vars.probCDWIN;
				vars.probABCOddsWIN = 				1/vars.probABCWIN;
				vars.probABDOddsWIN = 				1/vars.probABDWIN;
				vars.probACDOddsWIN = 				1/vars.probACDWIN;
				vars.probBCDOddsWIN = 				1/vars.probBCDWIN;
				vars.probABCDOddsWIN = 				1/vars.probABCDWIN;



				return parsed_data;

			}

		};

	};