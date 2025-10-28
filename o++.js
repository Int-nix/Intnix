function parseOOS(raw) {
  const expanded = expandnebulaScript(raw);
  const blocks = [...expanded.matchAll(/(\w+)\s*\{([\s\S]*?)\}/g)];
  const objectMap = {};
  const app = {
    settings: { title: "OOS App", width: 600, height: 400, x: 100, y: 100, draggable: true },
    html: `<div style="position:relative; width:100%; height:100%; font-family:monospace;">`,
    interactions: []
  };

  // Step 1: parse all objects into raw map
  const rawObjects = {};
  blocks.forEach(([_, name, body]) => {
    rawObjects[name] = body.trim().split("\n");
  });

  // Step 2: resolve all base+variant merging
  for (const [name, lines] of Object.entries(rawObjects)) {
    const match = name.match(/^(\w+?)(\d+)$/);
    let mergedLines = [];

    if (match) {
      const base = match[1];
      const baseLines = rawObjects[base] || [];
      mergedLines = [...baseLines, ...lines];
    } else {
      mergedLines = lines;
    }

    const fields = { commands: [] };
    for (let line of mergedLines) {
      const [rawKey, ...rest] = line.split(":");
      if (!rawKey || rest.length === 0) continue;
      const key = rawKey.trim().toLowerCase();
      const value = rest.join(":").trim().replace(/^"|"$/g, "");

      if (key === "command") {
        fields.commands.push(value);
      } else {
        fields[key] = value;
      }
    }

    objectMap[name] = fields;
  }

  // Helper to run commands sequentially with delay
  function runCommandsSequentially(commands, delay) {
    let index = 0;
    function runNext() {
      if (index >= commands.length) return;
      handleCommand(commands[index]);
      index++;
      if (index < commands.length) {
        setTimeout(runNext, delay);
      }
    }
    runNext();
  }

  // Generate DOM + interactions
  for (const [name, fields] of Object.entries(objectMap)) {
    const dragx = fields.dragx !== undefined ? parseInt(fields.dragx) : null;
    const dragy = fields.dragy !== undefined ? parseInt(fields.dragy) : null;
    const x = dragx !== null ? dragx : parseInt(fields.x || "0");
    const y = dragy !== null ? dragy : parseInt(fields.y || "0");

    const type = fields.type;
    const styleBase = `position:absolute; left:${x}px; top:${y}px;`;
    const color = fields.textcolor || "white";
    const btnColor = fields.buttoncolor || "#00ff88";
    const shapeColor = fields.shapecolor || "#888";
    const delay = (parseInt(fields.delay) || 0) * 1000;

    if (type === "shape") {
      let shapeStyle = `width:60px; height:60px; background:${shapeColor}; ${styleBase}`;
      const shape = fields.shape || "rounded";
      shapeStyle += shape === "circle" ? "border-radius:50%;" :
                    shape === "pill" ? "border-radius:30px;" :
                    shape === "square" ? "border-radius:0;" :
                    "border-radius:5px;";
      app.html += `<div id="${name}" style="${shapeStyle}"></div>`;
    }

    if (type === "text") {
      const content = fields.content || "";
      app.html += `<p id="${name}" style="${styleBase} color:${color}; margin:0;">${content}</p>`;
    }

    if (type === "input") {
      app.html += `<input id="input_${name}" placeholder="${fields.placeholder || ""}" style="${styleBase} padding:6px; width:200px; color:${color}; background:#111; border:1px solid ${btnColor};" />`;
    }

    if (type === "button") {
      const btnId = `btn_${name}`;
      const label = fields.label || "Click";
      const inputBind = fields.inputbind ? `input_${fields.inputbind}` : null;

      app.html += `<button id="${btnId}" style="${styleBase} padding:6px 14px; background:${btnColor}; border:none; color:${color}; cursor:pointer;">${label}</button>`;

      app.interactions.push(doc => {
        const btn = doc.getElementById(btnId);
        const boundInput = inputBind ? doc.getElementById(inputBind) : null;
        if (!btn) return;

        btn.addEventListener("click", () => {
          let cmds = [...fields.commands];
          if (boundInput) {
            cmds = cmds.map(cmd => cmd.replace("INPUT", boundInput.value));
          }
          runCommandsSequentially(cmds, delay);
        });
      });
    }

    if (fields.interact && fields.interact.toLowerCase() === "true" && fields.commands.length > 0) {
      app.interactions.push(doc => {
        const el = doc.getElementById(name);
        if (el) {
          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            runCommandsSequentially(fields.commands, delay);
          });
        }
      });
    }

    if (fields.drag && fields.drag.toLowerCase() === "true") {
      app.interactions.push(doc => {
        const el = doc.getElementById(name);
        if (!el) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        const originalPos = { x, y };

        el.style.cursor = "grab";
        el.style.userSelect = "none";

        el.addEventListener("mousedown", e => {
          isDragging = true;
          offsetX = e.offsetX;
          offsetY = e.offsetY;
          el.style.cursor = "grabbing";
          el.style.zIndex = 999;
        });

        doc.addEventListener("mouseup", () => {
          if (!isDragging) return;
          isDragging = false;
          el.style.cursor = "grab";

          if (fields.drop && fields.drop.toLowerCase() === "true") {
            const elRect = el.getBoundingClientRect();

            for (const [targetName, targetFields] of Object.entries(objectMap)) {
              if (targetFields.target && targetFields.target.toLowerCase() === "true") {
                const targetEl = doc.getElementById(targetName);
                if (!targetEl) continue;

                const targetRect = targetEl.getBoundingClientRect();

                const overlap = !(
                  elRect.right < targetRect.left ||
                  elRect.left > targetRect.right ||
                  elRect.bottom < targetRect.top ||
                  elRect.top > targetRect.bottom
                );

                if (overlap && targetFields.commands?.length) {
                  runCommandsSequentially(targetFields.commands, (parseInt(targetFields.delay) || 0) * 1000);
                  break;
                }
              }
            }

            el.style.left = originalPos.x + "px";
            el.style.top = originalPos.y + "px";
          }
        });

        doc.addEventListener("mousemove", e => {
          if (!isDragging) return;

          const parentRect = el.parentElement.getBoundingClientRect();
          const newX = e.clientX - parentRect.left - offsetX;
          const newY = e.clientY - parentRect.top - offsetY;

          el.style.left = newX + "px";
          el.style.top = newY + "px";

          objectMap[name].dragx = newX;
          objectMap[name].dragy = newY;
        });
      });
    }
  }

  app.html += `</div>`;
  return app;
}

function expandnebulaScript(script) {
  const lines = script.split("\n");
  const variables = {};
  const blocks = {};
  let i = 0;

  // Step 1: extract variables
  for (const line of lines) {
    const match = line.trim().match(/^var(\w+)\s*=\s*(\d+)$/);
    if (match) variables[match[1]] = parseInt(match[2]);
  }

  const output = [];

  // Step 2: loop through and expand
  while (i < lines.length) {
    const line = lines[i].trim();
    const blockMatch = line.match(/^\$(\w+?)(\d*)\s*\{$/);

    if (blockMatch) {
      const [_, baseName, variantNum] = blockMatch;
      let blockLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "}") {
        blockLines.push(lines[i]);
        i++;
      }
      i++;

      // Store blocks by name
      const blockKey = variantNum === "" ? `$${baseName}` : `$${baseName}${variantNum}`;
      blocks[blockKey] = blockLines;
    } else {
      output.push(lines[i]);
      i++;
    }
  }

  // Step 3: generate expanded output
  for (const [varName, count] of Object.entries(variables)) {
    const baseBlock = blocks[`$${varName}`] || [];

    for (let n = 0; n < count; n++) {
      const variantBlock = blocks[`$${varName}${n}`] || [];
      const combined = [...baseBlock, ...variantBlock];

      output.push(`${varName}${n} {`);
      for (let line of combined) {
        const replaced = line
          .replace(/\bauto\b/g, n)
          .replace(/(\d+)\s*\*\s*(\d+)/g, (_, a, b) => Number(a) * Number(b));
        output.push(replaced);
      }
      output.push("}");
    }
  }

  return output.join("\n");
}
