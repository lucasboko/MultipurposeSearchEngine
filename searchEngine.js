$(document).ready(function() {

    $(window).on("load", function(e) {
        if ($("#questionsearch").length) {
            $.widget("custom.catcomplete", $.ui.autocomplete, {
                _create: function() {
                    this._super();
                    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
                },
                _renderMenu: function(ul, items) {
                    var that = this, currentCategory = "";
                    $.each(items, function(index, item) {
                        var li;
                        if (item.category != currentCategory) {
                            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                            currentCategory = item.category;
                        }
                        li = that._renderItemData(ul, item);

                        if (item.category) {
                            li.attr("aria-label", item.category + " : " + item.label);
                            if (item.category === "Locations") {
                                li.html("<a href='/getlocation?questioncategory=All&questioncountry=" + item.country +
                                        "&questionstatelong=" + item.state + "&questioncity=" + item.city + "'><table><tr>" +
                                        "<td class='searchImage18'><img src='/img/searchLocation.png'></td>" +
                                        "<td class='searchText'><span>" + item.label + "</span><span/></td>" +
                                        "</tr></table></a>");
                            } else if (item.category === "Questions") {
                                var text;
                                if (item.label.length > 90) {
                                    text = (item.label.substr(0, 85) + "...");
                                } else {
                                    text = item.label;
                                }
                                li.html("<a href='/singlequestion?param=" + item.questionid +
                                        "&questioncategory=" + item.questioncategory + "&questioncountry=" + item.country +
                                        "&questionstatelong=" + item.state + "&questioncity=" + item.city + "'><table><tr>" +
                                        "<td class='searchImage18'><img src='/img/searchQuestion.png'></td>" +
                                        "<td class='searchText'><span>" + text + "</span><br/>" +
                                        "<span>" + item.city + ", " + item.state + ", " + item.country + ", " + "</span></td>" +
                                        "</tr></table></a>");
                            } else if (item.category === "Advisors") {
                                li.html("<a href='/usercallrequestpage?param=" + item.userid + "'><table><tr>" +
                                        "<td class='searchImage40'><img src='/img/assets/" + item.photo + ".jpg'></td>" +
                                        "<td class='searchText'><span>" + item.label + "</span><br/><span>" + item.location + "</span></td>" +
                                        "</tr></table></a>");
                            }
                        }
                    });
                }
            });

            var searchlist = [];
            $.ajax({
                url: '/searchitems',
                type: "POST",
                data: {type: 'questions'},
                success: function(response) {
//                    console.log(response);
                    var result = JSON.parse(response);
                    for (var x in result.locations) {
                        searchlist.push({
                            label: result.locations[x].location,
                            category: "Locations",
                            country: result.locations[x].questioncountry,
                            state: result.locations[x].questionstatelong,
                            city: result.locations[x].questioncity});
                    }
                    for (var x in result.questions) {
                        searchlist.push({
                            label: result.questions[x].questiontitle,
                            category: "Questions",
                            location: result.questions[x].location,
                            country: result.questions[x].questioncountry,
                            questionid: result.questions[x].questionid,
                            state: result.questions[x].questionstatelong,
                            questioncategory: result.questions[x].questioncategory,
                            city: result.questions[x].questioncity
                        });
                    }
                    for (var x in result.advisors) {
                        searchlist.push({
                            label: result.advisors[x].name,
                            category: "Advisors",
                            photo: result.advisors[x].profilepicture,
                            location: result.advisors[x].location,
                            userid: result.advisors[x].userid
                        });
                    }

                    $("#questionsearch").catcomplete({
                        minLength: 2,
                        source: searchlist,
                        autoFocus: true,
                        focus: function(event, ui) {
                            $("#questionsearchhidden").val(ui.item.label);
                            return false;
                        },
                        select: function(event, ui) {

                        },
                        close: function(event, ui) {
                            return false;
                        }
                    });
                }
            });
        }
    });
});
