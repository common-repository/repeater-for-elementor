<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
class Repeater_Start_Field extends \ElementorPro\Modules\Forms\Fields\Field_Base {
	private $fixed_files_indices = false;
	public function get_type() {
		return 'repeater_start';
	}
	public function editor_preview_footer() {
		add_action( 'wp_footer', array($this,"content_template_script"));
	}
	function content_template_script(){
    ?>
    <script>
    jQuery( document ).ready( () => {
        elementor.hooks.addFilter(
            'elementor_pro/forms/content_template/field/repeater_start',
            function ( inputField, item, i ) {
                return '<hr>';
            }, 10, 3
        );
    });
    </script>
    <?php
}
	public function get_name() {
		return esc_html__( 'Repeater Start', 'elementor-repeater-field' );
	}
	/**
	 * @param Widget_Base $widget
	 */
	public function update_controls( $widget ) {
		$check_pro = get_option( '_redmuber_item_1507');
		$elementor = \ElementorPro\Plugin::elementor();
		$control_data = $elementor->controls_manager->get_control_from_stack( $widget->get_unique_name(), 'form_fields' );
		if($check_pro == "ok") {
			$field_controls = [
				'repeater_title' => [
					'name' => 'repeater_title',
					'label' => esc_html__( 'Title', 'elementor-repeater-field' ),
					'type' => \Elementor\Controls_Manager::TEXT,
					'default' => 'Guest',
					'description'=>'An optional title before each row of the repeater',
					'condition' => [
						'field_type' => $this->get_type(),
					],
					'tab' => 'content',
					'inner_tab' => 'form_fields_content_tab',
					'tabs_wrapper' => 'form_fields_tabs',
				],
				'repeater_show_number' => [
					'name' => 'repeater_show_number',
					'label' => esc_html__( 'Show Index', 'elementor-repeater-field' ),
					'type' => \Elementor\Controls_Manager::SWITCHER,
					'default' => 'yes',
					'description' => 'Use the placeholder to print the current row index',
					'condition' => [
						'field_type' => $this->get_type(),
					],
					'tab' => 'content',
					'inner_tab' => 'form_fields_content_tab',
					'tabs_wrapper' => 'form_fields_tabs',
				],
				
			];
		}else{
			$field_controls = [
				'repeater_title' => [
					'name' => 'repeater_title',
					'label' => esc_html__( 'Title', 'elementor-repeater-field' ),
					'type' => \Elementor\Controls_Manager::TEXT,
					'default' => 'Guest',
					'description'=>'An optional title before each row of the repeater',
					'condition' => [
						'field_type' => $this->get_type(),
					],
					'tab' => 'content',
					'inner_tab' => 'form_fields_content_tab',
					'tabs_wrapper' => 'form_fields_tabs',
				],
				'repeater_show_number_pro' => [
					'name' => 'repeater_show_number_pro',
					'label' => esc_html__( 'Show Index', 'repeater-for-elementor' ),
					'type' => \Elementor\Controls_Manager::RAW_HTML,
					'content_classes' => 'pro_disable elementor-panel-alert elementor-panel-alert-info',
					'raw' => esc_html__( 'Upgrade to pro version', 'repeater-for-elementor' ),
					'condition' => [
						'field_type' => $this->get_type(),
					],
					'tab' => 'content',
					'inner_tab' => 'form_fields_content_tab',
					'tabs_wrapper' => 'form_fields_tabs',
				],
				
			];
		}
		
		
		$control_data['fields'] = $this->inject_field_controls( $control_data['fields'], $field_controls );
		$widget->update_control( 'form_fields', $control_data );
	}
	
	/**
	 * @param      $item
	 * @param      $item_index
	 * @param Form $form
	 */
	public function render( $item, $item_index, $form ) {	
		$form->add_render_attribute( 'div' . $item_index, 'class', 'elementor-field-repeater-start' );
		$repeater_show_number = (isset($item['repeater_show_number'])?$item['repeater_show_number']:"");
		?>
		<div <?php $form->print_render_attribute_string( 'div' . $item_index ); ?> >
			<textarea class="repeater-field-header-data hidden"><div class="repeater-field-header">
				<div class="repeater-field-header-title"><?php echo esc_html($item['repeater_title'] ) ?> <?php if( $repeater_show_number == "yes"){ ?><span class="repeater-field-header-count">1</span><?php } ?></div>
				<div class="repeater-field-header-acctions">
					<ul>
						<li><i class="repeater-icon icon-down-open repeater-field-header-acctions-toogle" aria-hidden="true"></i></li>
						<li><i class="repeater-icon icon-cancel-1 repeater-field-header-acctions-remove" aria-hidden="true"></i></li>
					</ul>
				</div>
			</div></textarea>
		</div>
		<?php
	}
	public function process_field( $field, $record, $ajax_handler ) {
		$id = $field['id'];
		$record->remove_field($id);
	}
	public function __construct() {
		parent::__construct();
		add_action( 'elementor/preview/init', array( $this, 'editor_preview_footer' ) );
	}
}
