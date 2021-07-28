function scraper(app) {

    return {

        get_user_data_arr: (data, exec) => {

            const all_tweets = data.data.threaded_conversation_with_injections.instructions[0].entries;

            const all_users = [];

            for (let i = 0; i < all_tweets.length; i++) {

                if (all_tweets[i].content.items) {

                    let user_object = all_tweets[i].content.items[0].item.itemContent.tweet_results.result.core.user.legacy;
                    let page_object = all_tweets[i].content.items[0].item.itemContent.tweet_results.result.legacy;


                    let user_info = {
                        "name": user_object.name,
                        "screen_name": '@' + user_object.screen_name,
                        "user_profile": 'https://twitter.com/' + user_object.screen_name,
                        "created_at": page_object.created_at,
                        "reply_to": [],
                        "profile_image": user_object.profile_image_url_https
                    }

                    const tweet_legacy = all_tweets[i].content.items[0].item.itemContent.tweet_results.result.legacy.entities.user_mentions;

                    if (tweet_legacy.length > -1) {
                        for (let q = 0; q < tweet_legacy.length; q++) {

                            user_info.reply_to.push(tweet_legacy[q].screen_name)
                        }
                    }


                    all_users.push(user_info)

                }

            }

            return all_users;

        },

        get_user_data_arr_from_favoriters: (data, exec) => {

            const all_users_likes = data.data.favoriters_timeline.timeline.instructions[0].entries;
            const all_users = [];

            for (let i = 0; i < all_users_likes.length; i++) {

                let user_object = all_users_likes[i].content.itemContent.user.legacy;

                let user = {
                    "name": user_object.name,
                    "screen_name": "@" + user_object.screen_name,
                    "profile_image": user_object.profile_image_url_https,
                    "user_profile": "https://twitter.com/" + user_object.screen_name

                }

                all_users.push(user);

            }


            return all_users;
        },

        html_to_wine_data_arr: (doc, exec) => {


        },

        doc_to_wine_data_arr: (doc, exec) => {

            var wine_data_arr = [];
            var wine_element_arr = doc.querySelectorAll(".c-product");

            for (let i = 0; i < wine_element_arr.length; i++) {

                let price_element = wine_element_arr[i].querySelector('.c-pricetag__price');

                let price_dollars = price_element.querySelector('span:nth-child(2)').innerText;
                let price_cents = price_element.querySelector('span:nth-child(3)').innerText;
                let price_number = parseFloat(price_dollars + '.' + price_cents);
                let flavors = [];

                if (!wine_element_arr[i].closest('.-hide')) {

                    let all_icons = wine_element_arr[i].querySelector('.c-product__icons').children;

                    for (var k = all_icons.length; k--;) {

                        let icon = all_icons[k]

                        exec("scraper", "check_wine_type", icon, flavors);
                        exec("scraper", "check_wine_bodied", icon, flavors);
                        exec("scraper", "check_wine_flavor", icon, flavors);

                    };

                    let element_object = {
                        title: wine_element_arr[i].querySelector('h2').innerText,
                        name: wine_element_arr[i].querySelector('.c-product__category').innerText.toLowerCase(),
                        description: wine_element_arr[i].querySelector('.c-product__description').innerText,
                        price: price_number,
                        image: wine_element_arr[i].querySelector('.c-product__imagebox').childNodes[1].getAttribute('src'),
                        flavors: flavors,
                    }

                    wine_data_arr.push(element_object);
                    flavors = [];

                }

            };

            return wine_data_arr;

        },

        check_wine_type: (el, flavors) => {
            if (el.classList.contains("-type-red-wine")) {

                flavors.push("red_wine");

            } else if (el.classList.contains("-type-white-wine")) {

                flavors.push("white_wine")
            }
        },

        check_wine_bodied: (el, flavors) => {
            if (el.classList.contains("-body-light-bodied")) {

                flavors.push("light-bodied");

            } else if (el.classList.contains("-body-medium-bodied")) {

                flavors.push("medium-bodied")
            } else if (el.classList.contains("-body-full-bodied")) {

                flavors.push("full-bodied")
            }
        },

        check_wine_flavor: (el, flavors) => {
            if (el.classList.contains("-flavor-floral")) {

                flavors.push("flavor-floral");
            } else if (el.classList.contains("-flavor-green-apple")) {

                flavors.push("flavor-green-apple")
            } else if (el.classList.contains("-flavor-black-berry")) {

                flavors.push("flavor-black-berry")
            } else if (el.classList.contains("-flavor-black-cherry")) {

                flavors.push("flavor-black-cherry")
            } else if (el.classList.contains("-flavor-lemon-lime")) {

                flavors.push("flavor-lemon-lime")
            } else if (el.classList.contains("-flavor-red-cherry")) {

                flavors.push("flavor-red-cherry")
            } else if (el.classList.contains("-flavor-pear")) {

                flavors.push("flavor-pear")
            } else if (el.classList.contains("-flavor-honey")) {

                flavors.push("flavor-honey")
            } else if (el.classList.contains("-flavor-vanilla")) {

                flavors.push("flavor-vanilla")
            }

        },

        doc_to_amazon_result_arr: (doc, exec) => {

            const all_amazon_elements = doc.querySelectorAll(`div[data-asin] [cel_widget_id*="MAIN-SEARCH_RESULTS"]`);

            const amazon_data_arr = [];

            let amazon_element_object;


            for (let i = 0; i < all_amazon_elements.length; i++) {

                let product_element = all_amazon_elements[i];

                let quantity;
                let price;

                if (product_element.querySelector('.a-spacing-top-micro a .a-size-base')) {

                    quantity = parseFloat(product_element.querySelector('.a-spacing-top-micro a .a-size-base').innerText.replace(",", "."));

                }

                if (product_element.querySelector('.a-price-whole')) {
                    price = parseFloat(product_element.querySelector('.a-price-whole').innerText + product_element.querySelector('.a-price-fraction').innerText)
                }

                amazon_element_object = {

                    image: product_element.querySelector('.s-image').getAttribute('src'),
                    info: product_element.querySelector('.a-size-medium').innerText,
                    link: product_element.querySelector('.a-link-normal').getAttribute('href'),
                    rating: '',
                    quantity: quantity,
                    price: price,
                }


                amazon_element_object.rating = exec("scraper", "element_to_rating", product_element);

                amazon_data_arr.push(amazon_element_object)


            }

            return amazon_data_arr;

        },

        element_to_rating: (el) => {

            var rating_element = el.querySelector("[class*='a-star-small']");
            var class_name = rating_element.getAttribute("class");
            var regexp = /a\-star\-small\-([0-9\-]+) /

            var match = class_name.match(regexp);

            return parseFloat(match[1].replace("-", "."));


        },

        doc_to_amazon_product_result: (doc, exec) => {

            const product_info_container = doc.querySelectorAll('.prodDetTable');

            let product_info = {};

            for (let q = 0; q < product_info_container.length; q++) {


                let tr_arr = product_info_container[q].rows;

                for (let i = 0; i < tr_arr.length; i++) {

                    let key = tr_arr[i].cells[0].innerText.trim();
                    let value = tr_arr[i].cells[1].innerText.trim();

                    product_info[key] = value;

                };

            }

            return product_info;


        },

        doc_to_amazon_diff_page_result_arr: (doc, exec) => {

            const all_amazon_elements = doc.querySelectorAll(`div[data-asin] [cel_widget_id*="MAIN-SEARCH_RESULTS"]`);

            const all_products = [];


            for (let i = 0; i < all_amazon_elements.length; i++) {

                let product_element = all_amazon_elements[i];
                let quantity;
                let price;

                if (product_element.querySelector('.a-spacing-top-micro a .a-size-base')) {

                    quantity = parseFloat(product_element.querySelector('.a-spacing-top-micro a .a-size-base').innerText.replace(",", "."));

                }

                if (product_element.querySelector('.a-price-whole')) {
                    price = parseFloat(product_element.querySelector('.a-price-whole').innerText + product_element.querySelector('.a-price-fraction').innerText)
                } else {
                    price = 'N/A'
                }


                let product_object = {
                    "image": product_element.querySelector('.s-image').getAttribute('src'),
                    "info": product_element.querySelector('h2').innerText,
                    "rating": '',
                    "quantity": quantity,
                    "price": price,
                }

                product_object.rating = exec("scraper", "element_to_rating", product_element);

                all_products.push(product_object);
            }


            return all_products;

        },

        doc_to_ebay_result_arr: (doc, exec) => {

            const all_ebay_products = doc.querySelectorAll('.s-item__wrapper');
            const ebay_products = [];

            for (let i = 0; i < all_ebay_products.length; i++) {


                if (all_ebay_products[i].querySelector('img')) {


                    let price_text = all_ebay_products[i].querySelector('.s-item__price').innerText.split('to');
                    let price;
                    let price_start;
                    let price_to;

                    for (let s = 0; s < price_text.length; s++) {
                        if (price_text.length > 1) {
                            price_start = parseFloat(price_text[0].substring(1));
                            price_to = parseFloat(price_text[1].substring(2));
                        } else price = parseFloat(price_text[0].substring(1))
                    }

                    let ebay_product = {
                        "image": all_ebay_products[i].querySelector('.s-item__image-img').getAttribute('src'),
                        "info": all_ebay_products[i].querySelector('h3').innerText,
                        "price": price || '',
                        "price_start": price_start || '',
                        "price_to": price_to || '',
                        "status": '',
                        "top": '',
                    }

                    if (all_ebay_products[i].querySelector('.s-item__hotness')) {
                        ebay_product.status = all_ebay_products[i].querySelector('.s-item__hotness').innerText;
                    }

                    if (all_ebay_products[i].querySelector('.s-item__etrs-text')) {
                        ebay_product.top = all_ebay_products[i].querySelector('.s-item__etrs-text').innerText;

                    }
                    ebay_products.push(ebay_product);
                }

            }

            return ebay_products;
        },

        doc_to_product_hunt_arr: (doc, exec) => {

            const all_products = doc.querySelectorAll('.styles_item__2kQQ5')

            let product_hunt_elements = [];

            for (let i = 0; i < all_products.length; i++) {
                
                let product = {
                    "title": all_products[i].querySelector("h3").innerText,
                    "info" : all_products[i].querySelector("h3").nextElementSibling.innerText,
                    "comments_quantity" : all_products[i].querySelector('.styles_actions__3Sc81 span').innerText,
                    "topic_link" : all_products[i].querySelector('.styles_postTopicLink__1jzrF').getAttribute('href'),
                    "votes" : all_products[i].querySelector('[data-test = "vote-button"] span span').innerText,
                    "image" : '',
                    "video" : ''
                }

                if(all_products[i].querySelector('.lazyload-wrapper img')){
                    product.image = all_products[i].querySelector('.lazyload-wrapper img').getAttribute('srcset')
                }

                if(all_products[i].querySelector('.lazyload-wrapper video')){
                    product.video = all_products[i].querySelector('.lazyload-wrapper video source').getAttribute('src')

                }

                product_hunt_elements.push(product)
            }

            return product_hunt_elements;


        },

        scrape: (exec) => {

            var amazon_result_arr = exec("scraper", "get_user_data_arr", document);

            exec("common", "post_window_message", app.state.iframe_content_window, "set_amazon_result_arr", {

                amazon_result_arr,

            });

        },

    };

};