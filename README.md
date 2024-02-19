# three-glyph

<p>
  <a href="https://www.npmjs.com/package/three-glyph"><img src="https://img.shields.io/npm/v/three-glyph" alt="Version"></a>
  <a href="https://www.npmjs.com/package/three-glyph"><img src="https://img.shields.io/npm/dy/three-glyph" alt="Downloads"></a>
  <a href="https://github.com/trinketmage/three-glyph/issues"><img src="https://img.shields.io/github/issues/trinketmage/three-glyph" alt="Issues"></a>
  <a href="https://github.com/trinketmage/three-glyph/blob/main/LICENSE"><img src="https://img.shields.io/github/license/trinketmage/three-glyph" alt="License"></a>
  <a href="https://twitter.com/remuemeninge"><img src="https://img.shields.io/twitter/follow/remuemeninge?style=social" alt="Twitter"></a>
</p>

ES6 adaptation of [three-bmfont-text](https://github.com/Experience-Monks/three-bmfont-text) and more..

Signed Distance Fields (SDF) are a method of reproducing vector shapes from a texture representation, popularized in [this paper by Valve](https://steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf). The integration of signed distance fields into [AngelCode BMFont files](https://www.angelcode.com/products/bmfont/) enables developers to create high-quality bitmap fonts with smooth, scalable outlines in a wide range of applications, offering both performance and visual fidelity benefits.

While SDFs offer efficient and high-quality rendering of simple shapes, [Multi-channel Signed Distance Fields (MSDF)] extend this capability to capture intricate details and sharp features in complex shapes, making them suitable for a wider range of applications, including text rendering, iconography, and graphic design.
To learn more about MSDFs you can read [Viktor Chlumský Master's thesis](https://github.com/Chlumsky/msdfgen/files/3050967/thesis.pdf) and his [github](https://github.com/Chlumsky/msdfgen).

[![image description](love.png)](https://three-glyph-examples.web.app/)

## Demo
 * [Basic](https://codepen.io/trinketmage/full/NWJJQWJ)
 * [Font atlas previewer](https://codepen.io/trinketmage/pen/KKEGOjx)
 * [Animation example](https://thre-glyph-animate-tool.web.app/)

### Advanced
 * [Per index](https://codepen.io/trinketmage/full/yLwwwKr)

## Getting Started
```
npm install three-glyph
```

## Usage

### Basic
```
npm install three-glyph
```

## Roadmap
 * [x] Basic GlyphGeometry
 * [x] Fix drawing vertices order
 * [x] Basic GlyphShader
 * [x] Basic GlyphMaterial
 * [x] Basic Glyph (Mesh)
 * [x] Glyph [anchorX and anchorY](https://protectwise.github.io/troika/troika-three-text/#anchorx)
 * [x] How to debug example
 * [x] Shader "chunkification"
 * [ ] Handles per lines and per character's index
 * [x] API animation per character
 * [ ] API animation per line
 * [ ] Example with custom map texture (video)
 * [ ] Example with [alphaMap per character](https://thre-glyph-animate-tool.web.app/) example with tutorial.
 * [ ] Right-to-left layout
 * [ ] Responsive : html context mirror layout
 * [ ] How to generate a MSDF Bitmap font
 * [ ] Font tweakings process
 * [ ] Documentation
 * [x] Negate map support

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

Copyright (c) 2024-present, Rémi Tran
