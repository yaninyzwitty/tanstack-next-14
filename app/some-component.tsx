type Props = {
  data: any;
};
function SomeComponent({data}: Props) {
  console.log(data);

  const {
    weather,
    base,
    main,
    visibility,
    wind,
    rain,
    clouds,
    dt,
    sys,
    timezone,
    id,
    name,
    cod,
  } = data;

  console.log(weather);
  console.log(base);
  console.log(main);
  console.log(visibility);
  console.log(wind);
  console.log(rain);
  console.log(clouds), dt, sys, timezone, id, name, cod;
  return <div>SomeComponent</div>;
}

export default SomeComponent;
