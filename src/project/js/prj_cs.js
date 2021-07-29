function prj_cs(app) {

    return {

        // project
        get_shortcode: (exec) => {

            let shortcode = location.href.slice(28);

            let cut_shortcode = shortcode.substring(0, shortcode.length - 1);

            return cut_shortcode;
        },


        fetch_instagram: async (shortcode, exec) => {

            let query_hash = "2efa04f61586458cef44441f474eee7c";

            let variables = encodeURIComponent(JSON.stringify({ "shortcode": shortcode, "child_comment_count": 3, "fetch_comment_count": 40, "parent_comment_count": 24, "has_threaded_comments": true }

            ))


            let result = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${ variables }`, {
                headers: app.state.all_headers
            })

            let json = await result.json();

            return json


        },

        get_count : (response,exec) => {

            let comments_count = response.data.shortcode_media.edge_media_to_parent_comment.count;

            return comments_count;
        },

        get_instagram_data_arr: (data, exec) => {

            let instagram_data_arr = data.data.shortcode_media.edge_media_to_parent_comment.edges;

            let instagram_user_arr = [];

            for (let i = 0; i < instagram_data_arr.length; i++) {  

                instagram_data_arr[i].node.type = "Comments";

                instagram_user_arr.push(instagram_data_arr[i].node);
            }


            return instagram_user_arr;


        },

        get_cursor: (data, exec) => {

            return data.data.shortcode_media.edge_media_to_parent_comment.page_info.end_cursor;

        },

        get_next_fetch: async (shortcode, cursor, exec) => {

            let query_hash = "bc3296d1ce80a24b1b6e40b1e72903f5";

            let variables = encodeURIComponent(JSON.stringify({ "shortcode": shortcode, "first": 12, "after": cursor }

            ))


            let result = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${ variables }`, {
                headers: app.state.all_headers
            })

            let json = await result.json();

            return json

        },

        get_next_instagram_data_arr: (next_response, exec) => {

            let instagram_data_arr = next_response.data.shortcode_media.edge_media_to_parent_comment.edges;



            let instagram_user_arr = [];

            for (let i = 0; i < instagram_data_arr.length; i++) {

                instagram_data_arr[i].node.type = "Comments";

                instagram_user_arr.push(instagram_data_arr[i].node)
            }


            return instagram_user_arr;


        },
        get_next_cursor: (next_response, exec) => {

            return next_response.data.shortcode_media.edge_media_to_parent_comment.page_info.end_cursor;

        },


        load_all_comments: async (instagram_arr, shortcode, cursor,count, exec) => {


            while (instagram_arr.length <= count) {

                let next_response = await exec("prj_cs", "get_next_fetch", shortcode, cursor);

                let next_instagram_arr = exec("prj_cs", "get_next_instagram_data_arr", next_response);

                let next_cursor = exec("prj_cs", "get_next_cursor", next_response);

                next_instagram_arr.forEach((item, index) => {

                    instagram_arr.push(item);

                })

                    await exec("util", "wait", 1000);
                    cursor = next_cursor;

            }


        },

        fetch_likes_instagram: async (shortcode, exec) => {

            let query_hash = "d5d763b1e2acf209d62d22d184488e57";

            let variables = encodeURIComponent(JSON.stringify({ "shortcode": shortcode, "include_reel": true, "first": 24 }

            ))


            let result = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${ variables }`, {
                headers: app.state.all_headers
            })

            let json = await result.json();

            return json
        },
        get_likes_data_arr: (likes_response, exec) => {

            let instagram_data_arr = likes_response.data.shortcode_media.edge_liked_by.edges;

            let instagram_user_arr = [];

            for (let i = 0; i < instagram_data_arr.length; i++) {

                instagram_data_arr[i].node.type = "Likes";

                instagram_user_arr.push(instagram_data_arr[i].node)
            }


            return instagram_user_arr;


        },

        get_likes_cursor: (likes_response, exec) => {

            return likes_response.data.shortcode_media.edge_liked_by.page_info.end_cursor;

        },


        next_likes_fetc: async (shortcode, cursor, exec) => {

            let query_hash = "d5d763b1e2acf209d62d22d184488e57";

            let variables = encodeURIComponent(JSON.stringify({ "shortcode": shortcode, "include_reel": true, "first": 12, "after": cursor }

            ))


            let result = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${ variables }`, {
                headers: app.state.all_headers
            })

            let json = await result.json();

            return json
        },

        next_likes_cursor: (likes_response, exec) => {

            return likes_response.data.shortcode_media.edge_liked_by.page_info.end_cursor;


        },

        load_all_likes: async (likes_arr, shortcode, likes_cursor, exec) => {

            var next_likes_cursor = likes_cursor;

            for ( var i = 0; i < 4; i++ ) {


                let likes_response = await exec("prj_cs", "next_likes_fetc", shortcode, next_likes_cursor);

                let nex_likes_arr = exec("prj_cs", "get_likes_data_arr", likes_response);

                next_likes_cursor = exec("prj_cs", "next_likes_cursor", likes_response);

                nex_likes_arr.forEach((item, index) => {

                    likes_arr.push(item);
                })

                await exec( "util", "wait", 1000 );

            };


        },

        init_all_func: async (exec) => {

            let shortcode = exec("prj_cs", "get_shortcode")

            let response = await exec("prj_cs", "fetch_instagram", shortcode);

            let count = exec("prj_cs" , "get_count" , response)

            let instagram_arr = exec("prj_cs", "get_instagram_data_arr", response);

            let cursor = exec("prj_cs", "get_cursor", response);

            await exec("prj_cs", "load_all_comments", instagram_arr, shortcode, cursor,count);

            let likes_response = await exec("prj_cs", "fetch_likes_instagram", shortcode);

            let likes_arr = exec("prj_cs", "get_likes_data_arr", likes_response);

            let likes_cursor = exec("prj_cs", "get_likes_cursor", likes_response);

            await exec("prj_cs", "load_all_likes", likes_arr, shortcode, likes_cursor);

            app.state.all_users_arr = instagram_arr.concat(likes_arr);
            exec("common", "post_window_message", app.state.iframe_content_window, "set_instagram_users_arr", {

                all_users_arr: app.state.all_users_arr
                // instagram_likes_arr: app.state.all_likes_arr.concat(likes_arr)

            });


        },

        collect: async (data, exec) => {

            app.state.all_users_arr = [];

            // app.state.all_likes_arr = [];

            exec("prj_cs", "init_all_func");


        },

        xhr_response_captured: (data, exec) => {

            app.state.all_headers = data.request_headers;


        },

        // common

        iframe_ready: (data, exec) => {


            app.state.iframe_content_window = data.event.source;


        },

        init_state: (state, exec) => {


        },

        init: async (app, exec) => {

            var tab_id = await exec("common", "background_exec", "bg", "get_tab_id", "_tab_");
            var storage = await exec("chrome", "call", "storage.local.get", ["tab_id_arr", "message_to_send"]);

            if (storage.tab_id_arr && storage.tab_id_arr.indexOf(tab_id) > -1) {

                var amazon_product_result = exec("scraper", 'doc_to_amazon_product_result', document);

                chrome.runtime.sendMessage({

                    name: "amazon_product_result_available",
                    data: {
                        amazon_product_result
                    }

                });

            };

            if (storage.message_to_send) {

                while (document.querySelector("[contenteditable]") === null) {

                    await exec("util", "wait", 200);

                };

                var contenteditable = document.querySelector("[contenteditable]");

                var br = contenteditable.querySelector("br");
                br.parentElement.innerHTML = `<span>${ storage.message_to_send }</span>`;


                contenteditable.focus()
                contenteditable.dispatchEvent(new Event("focus", { bubbles: true }))

                await exec("util", "wait", 100);

                contenteditable.dispatchEvent(new Event("input", { bubbles: true }))
                contenteditable.dispatchEvent(new Event("change", { bubbles: true }))

                await exec("util", "wait", 100);




                document.querySelector(`[aria-label="Send"]`).click();

            };

        },

    }

};