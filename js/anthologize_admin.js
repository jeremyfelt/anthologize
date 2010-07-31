var seq_stringify = function(seq_obj) {
    seq_string = '{';
    jQuery.each(seq_obj, function(post_id, seq_num){
        seq_string += '"' + post_id + '"' + ':' + '"' + seq_num + '",';
    });
    seq_string = seq_string.substr(0,seq_string.length-1);
    seq_string += '}';
    return seq_string;
}

var ajax_error_refresh = function() {
    jQuery('#blockUISpinner').append('<p>There has been an unexpected error. Please wait while we reload the content</p');
    location.reload();
}

jQuery.blockUI.defaults.onUnblock = function() {
    jQuery('#blockUISpinner').hide();
}

var anth_admin_ajax = {
    place_item: function(config_obj) {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {action:'place_item',
                   project_id:config_obj.project_id,
                   post_id:config_obj.item_id,
                   new_post:config_obj.new_item,
                   dest_id:config_obj.dest_id,
                   src_id:config_obj.src_id,
                   dest_seq:seq_stringify(config_obj.dest_seq),
                   src_seq:seq_stringify(config_obj.src_seq)},
            async:false,
            timeout:20000,
            success: function(data){
                if (config_obj.new_item == 'true') {
                    anthologize.updateAddedItem(data.post_id);
                }
                anthologize.setAppendStatus();
                return true;
            },
            complete: function(){
                jQuery.unblockUI();
            },
            error: function(){
                ajax_error_refresh();
            }
        });

    },
    merge_items: function(config_obj) {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {action:'merge_items',
                   project_id:config_obj.project_id,
                   post_id:config_obj.post_id,
                   child_post_ids:config_obj.child_post_ids,
                   new_seq:seq_stringify(config_obj.merge_seq)},
            async:false,
            timeout:20000,
            complete: function(){
                jQuery.unblockUI();
            },
            success: function(data){
                anthologize.updateAppendedItems(config_obj.child_post_ids);
            },
            error: function(){
                ajax_error_refresh();
            }
        });
    }
};
