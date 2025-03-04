# type: ignore

from .buttonInteraction import button_default, button_form_submit, button_bar_chart
from .displayInteraction import (
    display_code,
    display_header,
    display_image,
    display_json,
    display_markdown,
    display_none,
    display_spinner,
    display_text,
    display_pdf,
)
from .layoutInteraction import (
    layout_form,
    layout_stack,
    layout_row,
    layout_distributed_row,
    layout_card,
)
from .inputInteraction import (
    input_email,
    input_text,
    input_number,
    input_password,
    input_file_drop,
    input_date,
    input_time,
    input_datetime,
    input_url,
    select_dropdown_multi,
    select_dropdown_single,
    table,
    dataframe,
    radio_group,
    input_text_area,
    checkbox,
)
from .dynamicInteraction import dynamic_cond, dynamic_for_each
from .pageInteraction import page_confirm


class Component:
    # Inputs
    @property
    def text_input(self):
        return input_text

    @property
    def email_input(self):
        return input_email

    @property
    def number_input(self):
        return input_number

    @property
    def url_input(self):
        return input_url

    @property
    def password_input(self):
        return input_password

    @property
    def date_input(self):
        return input_date

    @property
    def time_input(self):
        return input_time

    @property
    def datetime_input(self):
        return input_datetime

    @property
    def text_area(self):
        return input_text_area

    @property
    def checkbox(self):
        return checkbox

    @property
    def file_drop(self):
        return input_file_drop

    @property
    def radio_group(self):
        return radio_group

    @property
    def multi_select_box(self):
        return select_dropdown_multi

    @property
    def select_box(self):
        return select_dropdown_single

    @property
    def table(self):
        return table

    @property
    def dataframe(self):
        return dataframe

    # Display
    @property
    def code(self):
        return display_code

    @property
    def header(self):
        return display_header

    @property
    def image(self):
        return display_image

    @property
    def json(self):
        return display_json

    @property
    def markdown(self):
        return display_markdown

    @property
    def pdf(self):
        return display_pdf

    @property
    def spinner(self):
        return display_spinner

    @property
    def text(self):
        return display_text

    # Layout
    @property
    def form(self):
        return layout_form

    @property
    def stack(self):
        return layout_stack

    @property
    def row(self):
        return layout_row

    @property
    def distributed_row(self):
        return layout_distributed_row

    @property
    def card(self):
        return layout_card

    # Button
    @property
    def button(self):
        return button_default

    @property
    def submit_button(self):
        return button_form_submit

    @property
    def bar_chart(self):
        return button_bar_chart

    # Dynamic
    @property
    def cond(self):
        return dynamic_cond

    @property
    def for_each(self):
        return dynamic_for_each


ComponentInstance = Component()
