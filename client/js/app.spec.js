//--------------------------------------------------------------------------------
var json = [
  {"in":1581310800752,"out":1581313200112,"license":"VFMPY3"},
  {"in":1581310800752,"out":1581368186047,"license":"8IJIFD"},
  {"in":1581310980752,"out":1581367566339,"license":"3D4CDX"}
];
//--------------------------------------------------------------------------------
var inst = new transactions();
describe("", () => {
  it ("check if ajax call to /api/event retrieved json object", async () => {
    var bool = false;
    await inst.init()
    .then(json => {
      if (typeof(json) == "object") bool = true;
    })
    expect(bool).toBe(true);
  })
  it ("check if get_duration returns a number and if that number has a decimal that it is rounded to the nearest hundredth.", () => {
    expect(inst.get_duration(json[0].out, json[0].in)).toMatch(/^[0-9]{0,2}(\.[0-9]{2}|)/);
  })
  it ("check if get_price(duration) returns FREE when duration is less than 1 hour.", () => {
    let duration = inst.get_duration(json[0].out, json[0].in);
    expect(inst.get_price(duration)).toMatch(/^FREE/);
  })
  it ("check if get_price(duration) returns a formatted price ($xxx.xx) when duration is greater than 1 hour", () => {
    let duration = inst.get_duration(json[1].out, json[1].in);
    expect(inst.get_price(duration)).toMatch(/^\$[0-9]{0,3}\.[0-9]{0,2}/);
  })
  it ("check if get_date_formatted(date) returns a properly formatted date (M/DD/YYYY h:mm:ss AM/PM)", () => {
    let duration = inst.get_duration(json[1].out, json[1].in);
    expect(inst.get_date_formatted(json[1].out)).toMatch(/^[0-9]{0,2}\/[0-9]{2}\/[0-9]{4}\s[0-9]{0,2}\:[0-9]{2}\:[0-9]{2} (AM|PM)/);
  })
})