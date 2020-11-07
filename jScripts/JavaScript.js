var userAmountAvailble = 5000;

var myProducts = [];

function product(name, catalogNum, expirationDate, price, discountPrice, src) {
    this.name = name;
    this.catalogNum = catalogNum;
    this.expirationDate = expirationDate;
    this.price = price;
    this.discountPrice = discountPrice;
    this.src = src;
    myProducts.push(this);
}

var product1 = new product("Milk", 100, "2020-08-25", 7, 5, "images/milk.jpg");
var product2 = new product("Cream Cheese", 101, "2020-09-02", 22, 17, "images/creamcheese.jpg");
var product3 = new product("Potato Chips", 102, "2020-12-28", 17, 15, "images/potatochips.jpg");
var product4 = new product("Rice", 103, "2022-06-01", 9, 8, "images/rice.jpg");
var product5 = new product("Eggs", 104, "2020-10-10", 15, 12, "images/eggs.png");
var product6 = new product("Wine", 105, "2021-01-22", 50, 45, "images/wine.jpeg");


$(document).ready(function () {

    console.log(myProducts);

    //כאשר לוחצים על כפתור הכניסה לחנות
    $("#enterBtn").click(function () {
        $(this).hide();
        $(".row-2").css("display", "block");

        //עדכון מוצרים קיימים
        i = 0;
        $(".col").each(function (index) {
            $(this).attr("id", i);
            $(this).children("figcaption").html(myProducts[i].catalogNum + '<br>' + myProducts[i].name);
            $(this).children("img").attr("src", myProducts[i].src);
            $(this).children("img").attr("alt", myProducts[i].name);
            $(this).children(".price").html("<span> Price: " + myProducts[i].price + "₪ </span>" + '<br>' + "Discount Price: " + myProducts[i].discountPrice + "₪");
            i++
        });
    });


    //הוספת כמות הפריטים הרצויה
    $(".fa-plus").click(function () {

        var TBValue = $(this).parent().children('.quantityInput').val();
        TBValue++;
        $(this).parent().children('.quantityInput').val(TBValue);

        if (TBValue > 1) {
            $(this).parent().children('.fa-minus').removeClass("disabled");
        }

        console.log("user added item quantity");

    });

    //הורדת כמות הפריטים הרצויה
    $(".fa-minus").click(function () {

        var TBValue = $(this).parent().children('.quantityInput').val();

        if (TBValue > 2) {
            TBValue--;
            $(this).parent().children('.quantityInput').val(TBValue);
            $(this).removeClass("disabled");
        }
        else if (TBValue == 2) {
            TBValue--;
            $(this).parent().children('.quantityInput').val(TBValue);
            $(this).addClass("disabled");
        }
        else {
        }

        console.log("user subtracted item quantity");
    });


    //בעת לחיצה על כפתור הוספה לסל קניות
    $(".addtocart").click(function () {


        var createCartItem = true;

        var productID = $(this).parent().attr("id");

        if (myProducts[productID].catalogNum != null) { //בדיקה אם מספר הקטלוג קיים בחנות

            if (userAmountAvailble >= myProducts[productID].discountPrice) { //בדיקה אם למשתמש יש מספר כסף עבור רכישת המוצר

                $("#cartDiv").css("display", "block");

                var quantity = $(this).parent().children(".quantityInput").val();

                //בדיקה אם המוצר נמצא כבר בסל הקניות
                $(".cartProducts").each(function (index) {

                    if ($(this).attr("data-product-id") == productID) {
                        var productQuantity = $(this).attr('data-quantity');

                        var newProductQuantity = Number(productQuantity) + Number($("#" + productID).children(".quantityInput").val());
                        $(this).attr('data-quantity', newProductQuantity);

                        if (quantity > 1) {
                            $("#" + productID).children(".fa-minus").removeClass("disabled");
                        }
                        $(this).children("p").html("<span>" + newProductQuantity + " x " + myProducts[productID].discountPrice + "₪ </span> <br/>" + newProductQuantity * myProducts[productID].discountPrice + "₪");

                        createCartItem = false;
                    }

                    console.log("user updated cart item quantity");

                });

                //אם המוצר אינו קיים בסל הקניות
                if (createCartItem == true) {
                    var post = $("<div>", {
                        'class': "cartProducts",
                        'data-product-id': productID,
                        'data-quantity': 1,
                    }).appendTo("#cartDiv");

                    var img = $('<img/>', { src: myProducts[productID].src, alt: myProducts[productID].name, class: 'cartImg' }).appendTo(post);
                    var figcaption = $('<figcaption/>').html(myProducts[productID].name).appendTo(post);
                    if (quantity > 1) {
                        var price = $('<p/>').html("<span>" + quantity + " x " + myProducts[productID].discountPrice + "₪ </span> <br/>" + quantity * myProducts[productID].discountPrice + "₪").appendTo(post);
                    }
                    else {
                        var price = $('<p/>').html("<span>" + quantity + " x " + "</span>" + myProducts[productID].discountPrice + "₪").appendTo(post);
                    }
                    var exit = $('<i/>', { class: 'fas fa-times' }).appendTo(post);

                    console.log("user added new item to cart");

                }

                //עדכון סכום הכסף שנותר למשתמש
                userAmountAvailble = (userAmountAvailble - myProducts[productID].discountPrice);

                console.log("user availble amount: " + userAmountAvailble)
            }
            else {
                alert("Your account does not have enough money to purchuse this product.")
            }
        }
        else {
            alert("This product does not exist in our shop.")
        }

    });


    //הסתרת חלון סל קניות בעת לחיצה
    $(".fa-window-close").click(function () {

        $("#cartDiv").css("display", "none");

    });


    //לחיצה על כפתור מחק פריט מסל הקניות
    $(document).on("click", ".fa-times", function () {
        var productID = $(this).parent().attr("data-product-id");
        var returnMoney = Number(myProducts[productID].discountPrice) * 0.8;

        userAmountAvailble = userAmountAvailble + returnMoney;

        $(this).parent().remove();

        alert("We have removed the product and refunded your account with " + returnMoney.toFixed(2) + " ₪. " +
            "Your availble balance is: " + userAmountAvailble + " ₪. (80%)");

        //בדיקה אם קיימים עוד מוצרים בסל קניות
        if ($(".cartProducts").length == 0) {
            $("#cartDiv").css("display", "none");
        }

    });


});