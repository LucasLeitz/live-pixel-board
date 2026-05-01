package com.lucas.live_pixel_board.dto;

public class PixelMessage {

    private int index;
    private String color;

    public PixelMessage() {
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}