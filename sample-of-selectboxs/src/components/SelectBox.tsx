interface SelectBoxProps {
  options: React.DetailedHTMLProps<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  >[];
  selectProps?: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >;
}

function SelectBox(props: SelectBoxProps) {
  return (
    <select {...props.selectProps}>
      <option value=""></option>
      {props.options.map((option) => (
        <>{option}</>
      ))}
    </select>
  );
}
export default SelectBox;
