

$(document).ready(function () {
    // Toggle tooltip
    $(document).tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });
    // No updating of that hash when it's just for a popover
    $(document.body).on('click', '.nameWrapper a, .personCard, .contributorCard', function (e) {
        e.preventDefault();
        return false;
    });
    $('.personCard').popover({
        html: true,
        container: 'body',
        content: function () {
            return $('#personCardTemplate').html();
        }
    });

    // Hide all but this
    $('.personCard').click(function(e){
        e.preventDefault();
        $('.personCard').not(this).popover('hide');
        return false;
    });

    // hide all popovers if any non-popover part of the body is clicked
    $( "body" ).on('click', function (e) {
        if (!$(e.target).parents('.popover-content').length) {
            $('.personCard').popover('hide');
        }
    });

    $('.toggleDetails').click(function(e) {
        e.preventDefault();
        var parent = $(this).parents('.family-panel:first');

        if ($(this).text().indexOf("Show") > -1) {
            $(this).html($(this).html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));

            $.each(parent.find('.detailsWell'), function( ) {
                if ($(this).find('.addDetail').length !== 0) {
                    return;
                }
                if (!$(this).hasClass('editing')) {
                    $(this).find('.hiddenDetails').fadeIn();
                    $(this).addClass('well openDetails');
                }
            });
        } else {
            $(this).html($(this).html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
            $.each(parent.find('.detailsWell'), function( ) {
                if (!$(this).hasClass('editing')) {
                    if ($(this).find('.addDetail').length !== 0) {
                        return;
                    }
                    $(this).find('.hiddenDetails').fadeOut();
                    $(this).removeClass('well openDetails');
                }
            });
        }

        return false;
    });

    $('.openEventDetails').click(function(e) {
        e.preventDefault();

        var parent = $(this).parents('.detailsWell:first');
        if (parent.hasClass('openDetails')) {
            parent.removeClass('well openDetails');
        } else {
            parent.addClass('well openDetails');
        }

        return false;
    });

    // Toggle panels/widget collapse
    $(document).on('click', 'a.panel-collapse', function () {
        $(this).children().toggleClass("fa-chevron-down fa-chevron-up");
        $(this).closest(".panel-heading").next().slideToggle({duration: 200});
        $(this).closest(".panel-heading").toggleClass('rounded-bottom');
        if ($(this).text() == "Close") {
            $(this).html($(this).html().replace('Close', 'Open'));
            $(this).parent().find('.toggleDetails').fadeOut();
        } else {
            $(this).html($(this).html().replace('Open', 'Close'));
            $(this).parent().find('.toggleDetails').fadeIn();
        }
        return false;
    });

    $('.closeDetail').click(function(e) {
        e.preventDefault();
        var parent = $(this).parents('.detailsWell:first');
        parent.removeClass('well').removeClass('openDetails');
        var toggle = $(this).parents('.family-panel:first').find('.toggleDetails');
        if ( parent.parents('.family-panel:first').find('.openDetails').length !== 0 ) {
            toggle.html(toggle.html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));
        } else {
            toggle.html(toggle.html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
        }
        return false;
    });


    $('.editDetail').click(function(e) {
        e.preventDefault();
        $(this).parents('.detailsWell:first').removeClass('openDetails').addClass('well').addClass('editing');
        return false;
    });

    $('.cancelButton').click(function(e) {
        e.preventDefault();
        var parent = $(this).parents('.detailsWell:first');
        var toggle = $(this).parents('.family-panel:first').find('.toggleDetails');

        if ($(this).parents('.family-panel:first').find('.detailsWell').length > 1) {
            toggle.html(toggle.html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));
            if (parent.find('.addDetail').length !== 0) {
                parent.removeClass('editing').removeClass('well');
            } else {
                parent.removeClass('editing').addClass('openDetails');
            }
        } else {
            parent.removeClass('editing well');
            toggle.html(toggle.html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
        }
        return false;
    });

    // Only one popover open at time
    $(':not(#anything)').on('click', function (e) {

        $('.contributorCard').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons and other elements within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
                return;
            }
        });
    });

    $('.btn').button();

    $('.changeTheme').click(function() {
        if ($('#themeContainer').hasClass('familysearch_theme')) {
            $('#themeContainer').removeClass('familysearch_theme');
            $(this).html($(this).html().replace('Boostrap', 'FamilySearch'));
        } else {
            $('#themeContainer').addClass('familysearch_theme');
            $(this).html($(this).html().replace('FamilySearch', 'Boostrap'));
        }
    });
    $('.noteValue').keyup(function() {
        if ($(this).val().length >= 10000) {
            return false;
        }
        $(this).parent().find('.countLimit').text(10000-$(this).val().length);
    });
    $('.addNewNote').click(function(e) {
        e.preventDefault();
        $('.addNewNoteContainer').removeClass('hide');
        return false;
    });
    $('.cancelNewNote, .saveNewNote').click(function(e) {
        e.preventDefault();
        $('.addNewNoteContainer').addClass('hide');
        return false;
    });

    $('.childHide, .hideChildren').click(function(e) {
        e.preventDefault();
        var elem = $(this);
        var container = $(this).parents('.immediateFamily:first');
        var parent = container.find('.childrenHolder:first');
        var hideAll = container.find('.hideChildren');
        var childrenList = parent.find('.panel-body');

        if (!childrenList.is(':hidden')) {
            childrenList.slideUp('medium', function() {
                elem.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                hideAll.html(hideAll.html().replace('fa-eye-slash', 'fa-eye').replace('Hide', 'Show'));
            });
        } else {
            childrenList.slideDown('medium', function() {
                elem.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                hideAll.html(hideAll.html().replace('fa-eye', 'fa-eye-slash').replace('Show', 'Hide'));
            });
        }
        return false;
    });


});