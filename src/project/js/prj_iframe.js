function prj_iframe(app) {

    return {

        // project

        product_image: (data, exec) => {

            exec("common", "post_window_message", window.parent, "get_product_image", data);

        },

        save_image: (data, exec) => {

            exec("common", "post_window_message", window.parent, "save_image", data);

        },

        scrape: (data, exec) => {

            exec("common", "post_window_message", window.parent, "scrape", null);

        },


        collect: (data, exec) => {

            exec("common", "post_window_message", window.parent, "collect", null);

        },

        message: async (data, exec) => {

            var tab_id = await exec("common", "background_exec", "bg", "get_tab_id", "_tab_");
            chrome.storage.local.set({

                message_to_send: "Here is the link to my free e-book ;)"

            }, async function() {

                chrome.tabs.update(tab_id, {

                    url: "https://twitter.com/messages/2429189473-1418135400699334656",

                });

            });

        },

        // common

        init_state: (state, exec) => {

            exec("common", "update_object", state, {

                model: {

                    active_page_name: "main",
                    root_url: "chrome-extension://" + chrome.runtime.id,
                    drawer_item_hash: {

                    },
                    table_model: {
                        table_row_width: 25,
                        main_row_cell_arr: [],
                        row_arr: [],

                    },


                },

            });

        },

        set_instagram_users_arr: (data, exec) => {

            app.state.model.table_model.main_row_cell_arr = [{
                    title: "Profile Image",
                },
                {
                    title: "Name",
                },
                {
                    title: "Text",
                },
            ];

            app.state.model.table_model.row_arr = [];

            // for (let i = 0; i < data.instagram_user_arr.length; i++) {

            //     var item = data.instagram_user_arr[i];

            //     app.state.model.table_model.row_arr.push([

            //         {
            //             type: "image",
            //             value: item.owner.profile_pic_url,
            //         },
            //         {
            //             type: "text",
            //             value: item.owner.username,
            //         },
            //         {
            //             type: "text",
            //             value: item.text,
            //         },

            //     ])

            //     app.state.model.table_model.table_row_width = 33.3;

            // };

            for (let i = 0; i < data.instagram_likes_arr.length; i++) {
                var item = data.instagram_likes_arr[i];

                app.state.model.table_model.row_arr.push([

                    {
                        type: "image",
                        value: item.profile_pic_url,
                    },
                    {
                        type: "text",
                        value: item.full_name,
                    },
                    {
                        type: "text",
                        value: item.username,
                    },

                ])

                app.state.model.table_model.table_row_width = 33.3;
            }
        },

        init: async (app, exec) => {


        },

    }

};